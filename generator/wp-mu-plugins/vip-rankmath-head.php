<?php
/**
 * VIP — stop Rank Math competing with the page's own head.
 *
 * Reference copy. The live file is at
 * wp-content/novamira-sandbox/vip-rankmath-head.php on viphomepainting.com.
 * Kept here so it survives a rebuild, migration, or restore. See README.md.
 *
 * Applies ONLY to pages flagged _vip_generated. Everything Fabian builds in
 * Elementor keeps Rank Math exactly as it is.
 *
 * Two problems, both found on the live front page after publishing:
 *
 *  1. TWO JSON-LD graphs. Our generated pages carry a hand-built graph
 *     (HomeAndConstructionBusiness + Service + FAQPage + WebPage +
 *     BreadcrumbList, page-specific) inside the content. Rank Math emits its
 *     own generic one into the head regardless of rank_math_rich_snippet, so
 *     the page shipped two competing descriptions of the same business.
 *     Ours is richer and per-page, so Rank Math's is the one that goes.
 *
 *  2. NO og:image. publish-wp.js sends the body, styles, scripts and JSON-LD,
 *     but not the source file's <head>, so the og:image and twitter:image we
 *     author never reach WordPress. Rank Math filled in title, description and
 *     url from the meta it was given and left the image blank, which means
 *     every share of the home page came out as a bare text card.
 */

/** Is the current request one of our generated pages? */
function vip_rmh_is_generated() {
	if ( ! is_singular( 'page' ) ) {
		return false;
	}
	$id = get_queried_object_id();
	return $id && get_post_meta( $id, '_vip_generated', true ) === '1';
}

/**
 * 1. Drop Rank Math's JSON-LD on these pages. Returning an empty array leaves
 *    Rank Math with nothing to print, so only our graph survives.
 */
add_filter( 'rank_math/json_ld', function ( $data ) {
	return vip_rmh_is_generated() ? array() : $data;
}, 99 );

/**
 * 2. Supply the social image. Emitted directly rather than through a Rank Math
 *    filter because Rank Math outputs no image tag at all here — there is
 *    nothing to filter, so there is nothing to collide with either.
 *
 *    Priority 99 puts it after Rank Math's own head output.
 */
add_action( 'wp_head', function () {
	if ( ! vip_rmh_is_generated() ) {
		return;
	}

	$img = apply_filters(
		'vip_social_image',
		content_url( 'uploads/vip-assets/video/hero-poster.jpg' )
	);

	// Never advertise an image that is not there.
	$path = ABSPATH . 'wp-content/uploads/vip-assets/video/hero-poster.jpg';
	if ( ! file_exists( $path ) ) {
		return;
	}

	printf( "<meta property=\"og:image\" content=\"%s\" />\n", esc_url( $img ) );
	printf( "<meta property=\"og:image:secure_url\" content=\"%s\" />\n", esc_url( $img ) );
	echo "<meta property=\"og:image:width\" content=\"1152\" />\n";
	echo "<meta property=\"og:image:height\" content=\"771\" />\n";
	printf( "<meta name=\"twitter:image\" content=\"%s\" />\n", esc_url( $img ) );
}, 99 );
