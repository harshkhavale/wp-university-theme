<?php get_header() ?>
<div class="page-banner">
    <div class="page-banner__bg-image" style="background-image: url(<?php echo get_theme_file_uri('/images/ocean.jpg') ?>)"></div>
    <div class="page-banner__content container t-center c-white">
        <h1 class="page-banner__title">All Event's</h1>
        <p>See what is going on in our world. </p>
        <div class="page-banner__intro">
        </div>
    </div>
</div>
<div class="container container--narrow page-section">
    <?php
    while (have_posts()) {
        the_post(); ?>

        <div class="event-summary">
            <a class="event-summary__date t-center" href="#">
                <?php
                $eventDate = new DateTime(get_field('event_date'));

                ?>
                <span class="event-summary__month"><?php echo $eventDate->format('M') ?></span>
                <span class="event-summary__day"><?php echo $eventDate->format('d') ?></span>
            </a>
            <div class="event-summary__content">
                <h5 class="event-summary__title headline headline--tiny"><a href="<?php the_permalink() ?>"><?php the_title() ?></a></h5>
                <p><?php if (has_excerpt()) {
                        echo get_the_excerpt();
                    } else {
                        echo wp_trim_words(get_the_content(), 18);
                    } ?>
                    <a href="<?php the_permalink() ?>" class="nu gray">Read more</a>
                </p>
            </div>
        </div>
    <?php
    }
    ?>
    <hr class="section-break">
    <p> <a href="<?php echo site_url('/past-events')?>">Looking for a recap of past events? Check out our past events archive</a></p>
</div>

<?php get_footer() ?>