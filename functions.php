<?php
require get_theme_file_path('/inc/search-route.php');
function pageBanner($args = NULL) {
  
    if (!isset($args['title'])) {
      $args['title'] = get_the_title();
    }
   
    if (!isset($args['subtitle'])) {
      $args['subtitle'] = get_field('page_banner_subtitle');
    }
   
    if (!isset($args['photo'])) {
      if (get_field('page_banner_background') AND !is_archive() AND !is_home() ) {
        $args['photo'] = get_field('page_banner_background')['sizes']['pageBanner'];
      } else {
        $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
      }
    }
    ?>
    <div class="page-banner">
        <div class="page-banner__bg-image" style="background-image: url(<?php echo esc_url($args['photo']); ?>)"></div>
        <div class="page-banner__content container t-center c-white">
            <h1 class="page-banner__title"><?php echo esc_html($args['title']); ?></h1>
            <div class="page-banner__intro">
                <p><?php echo esc_html($args['subtitle']); ?></p>
            </div>
        </div>
    </div>
    <?php
}
function university_files()
{
    wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
    wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));
    wp_enqueue_style('font_awesome', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN');
    wp_enqueue_script('main-university-js', get_theme_file_uri('/build/index.js'), array('jquery'), 1.0, true);
    wp_localize_script('main-university-js', 'universityData',array(
        'root_url' =>get_site_url()
    ));
}
add_action('wp_enqueue_scripts', 'university_files');
function university_features()
{
    register_nav_menu('headerMenuLocation', 'Header Menu Location');
    register_nav_menu('FooterLocation1', 'Footer Location 1');
    register_nav_menu('FooterLocation2', 'Footer Location 2');

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_image_size('prof-landscape',400,260,true);
    add_image_size('prof-potrait',480,650,true);
    add_image_size('pageBanner',1500,350,true);
}
function university_custom_rest(){
    register_rest_field('post','authorName',array(
        'get_callback' => function(){
return get_the_author();
        }
    ));
}
add_action('rest_api_init','university_custom_rest');
add_action('after_setup_theme', 'university_features');
function university_adjust_queries($query)
{
    $today = date('Ymd');
    if (!is_admin() AND is_post_type_archive('event') AND $query->is_main_query()) {
        $query->set('orderby', 'meta_value_num');
        $query->set('order', 'ASC');
        $query->set('meta_key', 'event_date');
        $query->set('meta_query', array(
            array(
                'key' => 'event_date',
                'compare' => '>=',
                'value' => $today,
                'type' => 'numeric'
            )
        ));
    }
    if(!is_admin() AND is_post_type_archive('program') AND is_main_query()){
        $query->set('orderby','title');
        $query->set('order','ASC');
        $query->set('posts_per_page',-1);
    }
}
add_action('pre_get_posts', 'university_adjust_queries');
