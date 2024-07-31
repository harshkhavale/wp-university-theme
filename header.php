<!DOCTYPE html>
<html <?php language_attributes() ?>>

<head>
  <meta charset=<?php bloginfo('charset') ?> />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Fictional University</title>
  <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i" rel="stylesheet" />
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous" />
  <link rel="stylesheet" href="build/index.css" />
  <link rel="stylesheet" href="build/style-index.css" />
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <?php
  wp_head();
  ?>
</head>

<body <?php body_class() ?>>
  <?php wp_body_open() ?>
  <header class="site-header">
    <div class="container">
      <h1 class="school-logo-text float-left">
        <a href="<?php echo site_url() ?>"><strong>Fictional</strong> University</a>
      </h1>
      <a href="<?php esc_url(site_url('/search')) ?>" class="js-search-trigger site-header__search-trigger"><i class="fa fa-search" aria-hidden="true"></i></a>
      <i class="site-header__menu-trigger fa fa-bars" aria-hidden="true"></i>
      <div class="site-header__menu group">
        <nav class="main-navigation">
          <?php wp_nav_menu(array('theme_location' => 'headerMenuLocation')) ?>

        </nav>
        <div class="site-header__util">
          <?php if (is_user_logged_in()) {
          ?>
            <a href="<?php echo wp_logout_url() ?>" class="btn btn--small btn--dark-orange float-left btn--with-photo"><span class="site-header__avatar">
                <?php echo get_avatar(get_current_user_id()) ?>
              </span><span class="btn__text">
                Log out
              </span></a>
          <?php
          } else {
          ?> <a href="<?php echo wp_login_url() ?>" class="btn btn--small btn--orange float-left push-right">Login</a>
            <a href="<?php echo wp_registration_url() ?>" class="btn btn--small btn--dark-orange float-left">Sign Up</a>

          <?php

          } ?>
          <a href="<?php esc_url(site_url('/search')) ?>" class="search-trigger js-search-trigger"><i class="fa fa-search" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>
  </header>