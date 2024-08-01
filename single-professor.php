<?php
get_header();
while (have_posts()) {
    the_post();
?>
    <?php get_header();
    ?>
    <?php
    pageBanner(); ?>

    <div class="container container--narrow page-section">

        <div class="generic-content">
            <div class=" row group">
                <div class="one-third">
                    <?php the_post_thumbnail('prof-potrait') ?>

                </div>
                <div class="two-third">
                    <?php
                    $likeCount = new WP_Query(
                        array(
                            'post_type' => 'like',
                            'meta_query' => array(
                                array(
                                    'key' => 'liked_professor_id',
                                    'value' => get_the_ID(),
                                    'compare' => '='
                                )
                            ),
                        )
                    )
                    ?>
                    <span class="like-box">
                        <i class="fa fa-heart-o" aria-hidden="true"></i>
                        <i class="fa fa-heart-o" aria-hidden="true"></i>
                        <span class="like-count"><?php echo $likeCount->found_posts ?></span>
                    </span>
                    <?php the_content() ?>

                </div>

            </div>
        </div>
    </div>
    <?php
    $relatedPrograms = get_field('related_programs');

    if ($relatedPrograms) {
    ?>
        <hr class=" section-break">
        <div class=" container">
            <h2 class=" headline headline--medium">Subject(s) Taught</h2>
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
        </div>

    <?php

    }
    ?>



<?php

}
get_footer();
?>