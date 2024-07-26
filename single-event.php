<?php
get_header();
while (have_posts()) {
    the_post();
?>
    <?php get_header() ?>
    <div class="page-banner">
        <div class="page-banner__bg-image" style="background-image: url(<?php echo get_theme_file_uri('/images/ocean.jpg') ?>)"></div>
        <div class="page-banner__content container t-center c-white">
            <h1 class="page-banner__title"><?php the_title() ?></h1>
            <div class="page-banner__intro">
                <p>Keep up with our latest news.</p>
            </div>
        </div>
    </div>
    <div class="container container--narrow page-section">
        <div class="metabox metabox--position-up metabox--with-home-link">
            <p>
                <a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('event'); ?>">
                    <i class="fa fa-home" aria-hidden="true"></i>
                    Events Home</a>
                <span class="metabox__main">Posted by <?php the_author_posts_link() ?> on <?php the_time('n.j.y') ?> in <?php echo get_the_category_list(', '); ?> </span>
            </p>
        </div>
        <div class="generic-content">
            <?php the_content() ?>
        </div>
    </div>
    <?php
    $relatedPrograms = get_field('related_programs');

    if ($relatedPrograms) {
    ?>
        <hr class=" section-break">
        <h2 class=" headline headline--medium">Related Program(s)</h2>
        <ul class="link-list min-list">

            <?php
            foreach ($relatedPrograms as $program) {
            ?>
                <li>
                    <a href="<?php echo get_the_permalink($program) ?>">
                        <?php
                        echo get_the_title($program);

                        ?>
                    </a>
                </li>
            <?php

            }
            ?>
        </ul>
    <?php

    }
    ?>



<?php

}
get_footer();
?>