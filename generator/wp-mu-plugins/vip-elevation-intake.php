<?php
/**
 * Plugin Name: VIP — Elevation Intake
 * Description: Receives the Step Five upload (photo + address/community + name +
 *              cell), files the photo in the media library, stores the lead where
 *              it can be read in wp-admin, and emails it. Turns the endpoint on
 *              for generated pages automatically.
 * Version:     1.0
 *
 * INSTALL — same as the other four: drop this in
 *   wp-content/novamira-sandbox/
 * (or mu-plugins if you have file access). Nothing else to configure.
 *
 * WHAT IT SWITCHES ON
 * Step Five reads window.VIP_UPLOAD_ENDPOINT. This file prints that variable
 * into every page carrying _vip_generated = 1, so installing it is what flips
 * the section from "text us the photo" to a real upload. On the github.io build
 * there is no WordPress, the variable stays unset, and the text-message handoff
 * keeps working — which is what you want, since that copy is not the
 * destination.
 *
 * SECURITY NOTE, because this is the one public unauthenticated endpoint on the
 * site. A static page cannot carry a useful nonce, so the defences here are:
 * strict image-only validation by real bytes and not by filename, a size cap, a
 * honeypot field, a per-IP rate limit, and text sanitised on the way in. The
 * upload never becomes an executable path — wp_handle_upload decides the
 * filename, not the visitor.
 */

if (!defined('ABSPATH')) exit;

const VIP_INTAKE_ROUTE      = 'vip/v1';
const VIP_INTAKE_POST_TYPE  = 'vip_elevation';
const VIP_INTAKE_MAX_BYTES  = 12582912;   /* 12 MB — a phone photo, not a RAW */
const VIP_INTAKE_RATE_LIMIT = 5;          /* submissions per IP per hour */

/* ------------------------------------------------------------------ *
 * 1 · Somewhere for the leads to land that is not only an inbox.
 *     Email gets missed and cannot be searched six months later.
 * ------------------------------------------------------------------ */
add_action('init', function () {
    register_post_type(VIP_INTAKE_POST_TYPE, [
        'labels' => [
            'name'          => 'Elevation Requests',
            'singular_name' => 'Elevation Request',
            'menu_name'     => 'Elevation Requests',
        ],
        'public'        => false,
        'show_ui'       => true,
        'menu_icon'     => 'dashicons-format-image',
        'menu_position' => 26,
        'supports'      => ['title', 'editor', 'thumbnail'],
        'capability_type' => 'post',
        'map_meta_cap'  => true,
    ]);
});

/* ------------------------------------------------------------------ *
 * 2 · The endpoint.
 * ------------------------------------------------------------------ */
add_action('rest_api_init', function () {
    register_rest_route(VIP_INTAKE_ROUTE, '/elevation', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',   /* public by design */
        'callback'            => 'vip_intake_receive',
    ]);
});

function vip_intake_client_ip() {
    $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '0.0.0.0';
    return substr(preg_replace('/[^0-9a-f:.]/i', '', $ip), 0, 45);
}

function vip_intake_receive(WP_REST_Request $req) {

    /* honeypot — the form ships a field no human ever sees or fills */
    if (trim((string) $req->get_param('website')) !== '') {
        return new WP_REST_Response(['ok' => true], 200);   /* look successful, do nothing */
    }

    /* rate limit, per IP per hour */
    $key   = 'vip_intake_' . md5(vip_intake_client_ip());
    $count = (int) get_transient($key);
    if ($count >= VIP_INTAKE_RATE_LIMIT) {
        return new WP_Error('vip_rate_limited',
            'That is a few more than we can take right now — please call (909) 312-5400.',
            ['status' => 429]);
    }

    /* required text */
    $name    = sanitize_text_field((string) $req->get_param('name'));
    $place   = sanitize_text_field((string) $req->get_param('place'));
    $contact = sanitize_text_field((string) $req->get_param('contact'));
    if ($name === '' || $place === '' || $contact === '') {
        return new WP_Error('vip_missing_fields',
            'We need a name, a community or address, and somewhere to send the renders.',
            ['status' => 400]);
    }

    /* whatever they had selected in the visualizer — nice to have, never required */
    $selections = [];
    foreach (['scheme', 'lighting', 'siding', 'premium'] as $k) {
        $v = sanitize_text_field((string) $req->get_param($k));
        if ($v !== '') $selections[$k] = $v;
    }

    /* the photo */
    $files = $req->get_file_params();
    if (empty($files['photo']) || !isset($files['photo']['tmp_name'])) {
        return new WP_Error('vip_no_photo', 'No photo arrived with the request.', ['status' => 400]);
    }
    $photo = $files['photo'];

    if (!empty($photo['error'])) {
        return new WP_Error('vip_upload_error', 'That photo did not finish uploading — try again.', ['status' => 400]);
    }
    if ((int) $photo['size'] > VIP_INTAKE_MAX_BYTES) {
        return new WP_Error('vip_too_large',
            'That photo is larger than 12MB — a standard phone photo is perfect.',
            ['status' => 413]);
    }

    /* Trust the bytes, never the filename. getimagesize fails on anything that
       is not a real raster image, which is the check that matters here. */
    $probe = @getimagesize($photo['tmp_name']);
    /* ?? does not guard an undefined CONSTANT — on PHP 8 that is a fatal,
       and IMAGETYPE_HEIC only exists on newer builds. */
    $allowed = [IMAGETYPE_JPEG, IMAGETYPE_PNG];
    if (defined('IMAGETYPE_WEBP')) $allowed[] = IMAGETYPE_WEBP;
    if (defined('IMAGETYPE_HEIC')) $allowed[] = IMAGETYPE_HEIC;
    if ($probe === false || !in_array($probe[2], $allowed, true)) {
        return new WP_Error('vip_not_an_image',
            'That file is not a photo we can render from — JPG, PNG, WEBP or HEIC.',
            ['status' => 415]);
    }

    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    /* media_handle_sideload names the file, not the visitor */
    $attachment_id = media_handle_sideload([
        'name'     => 'elevation-' . wp_generate_password(8, false) . '.jpg',
        'tmp_name' => $photo['tmp_name'],
    ], 0, 'Elevation submitted by ' . $name . ' — ' . $place);

    if (is_wp_error($attachment_id)) {
        return new WP_Error('vip_store_failed',
            'We could not file that photo — please call (909) 312-5400.',
            ['status' => 500]);
    }

    /* the lead record */
    $body = "Name: {$name}\nCommunity or address: {$place}\nBest contact: {$contact}\n";
    foreach ($selections as $k => $v) {
        $body .= ucfirst($k) . ": {$v}\n";
    }
    $body .= "\nSubmitted: " . current_time('mysql');

    $post_id = wp_insert_post([
        'post_type'    => VIP_INTAKE_POST_TYPE,
        'post_status'  => 'private',
        'post_title'   => $name . ' — ' . $place,
        'post_content' => $body,
    ], true);

    if (!is_wp_error($post_id)) {
        set_post_thumbnail($post_id, $attachment_id);
        update_post_meta($post_id, '_vip_contact', $contact);
        update_post_meta($post_id, '_vip_place', $place);
        foreach ($selections as $k => $v) update_post_meta($post_id, '_vip_' . $k, $v);
    }

    set_transient($key, $count + 1, HOUR_IN_SECONDS);

    /* and the nudge, because nobody watches wp-admin all day */
    $to = apply_filters('vip_intake_notify', get_option('admin_email'));
    wp_mail(
        $to,
        'New elevation request — ' . $name . ' (' . $place . ')',
        $body . "\n\nPhoto: " . wp_get_attachment_url($attachment_id) .
        (is_wp_error($post_id) ? '' : "\nIn admin: " . get_edit_post_link($post_id, 'raw'))
    );

    return new WP_REST_Response([
        'ok'      => true,
        'message' => 'Your elevation is with the design team.',
    ], 201);
}

/* ------------------------------------------------------------------ *
 * 3 · Switch Step Five over, on generated pages only.
 *     Same _vip_generated = 1 gate the other four use, so nothing Fabian
 *     builds in Elementor is touched.
 * ------------------------------------------------------------------ */
add_action('wp_head', function () {
    if (!is_singular()) return;
    if (get_post_meta(get_the_ID(), '_vip_generated', true) !== '1') return;
    printf(
        "<script>window.VIP_UPLOAD_ENDPOINT=%s;</script>\n",
        wp_json_encode(esc_url_raw(rest_url(VIP_INTAKE_ROUTE . '/elevation')))
    );
}, 5);
