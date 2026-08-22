<?php
/**
 * VIP — expose Rank Math meta to the REST API.
 *
 * Reference copy. The live file is at
 * wp-content/novamira-sandbox/vip-rankmath-rest-meta.php on viphomepainting.com.
 * Kept here so it survives a rebuild, migration, or restore. See README.md.
 *
 * Rank Math stores its SEO fields as post meta but does not register them for
 * REST, so an update request that includes them is silently dropped. Confirmed
 * live on 2026-08-22: a page published via REST came back with the site name
 * appended to its title, an auto-generated description that had grabbed a CSS
 * comment out of our inline styles, index,follow forced over our noindex, and a
 * second JSON-LD graph competing with ours.
 *
 * Registering the keys lets generator/publish-wp.js set them in the same call
 * that creates the page, with no manual cleanup per page.
 */

add_action( 'init', function () {
	$string_keys = array(
		'rank_math_title',
		'rank_math_description',
		'rank_math_canonical_url',
		'rank_math_focus_keyword',
		'rank_math_rich_snippet',
	);

	foreach ( $string_keys as $key ) {
		register_post_meta( 'page', $key, array(
			'type'          => 'string',
			'single'        => true,
			'show_in_rest'  => true,
			'auth_callback' => function () { return current_user_can( 'edit_posts' ); },
		) );
	}

	// robots is an array of tokens, e.g. array( 'noindex', 'nofollow' )
	register_post_meta( 'page', 'rank_math_robots', array(
		'type'          => 'array',
		'single'        => true,
		'show_in_rest'  => array(
			'schema' => array(
				'type'  => 'array',
				'items' => array( 'type' => 'string' ),
			),
		),
		'auth_callback' => function () { return current_user_can( 'edit_posts' ); },
	) );

	// set by publish-wp.js so vip-generated-pages.php knows which pages to protect
	register_post_meta( 'page', '_vip_generated', array(
		'type'          => 'string',
		'single'        => true,
		'show_in_rest'  => true,
		'auth_callback' => function () { return current_user_can( 'edit_posts' ); },
	) );
}, 20 );
