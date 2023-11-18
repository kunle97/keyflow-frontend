import React from "react";

const Blog = () => {
  return (
    <section className="mb-5 landing-section">
      <div className="section-header">
        <h2>Landlord Guide</h2>
        <p>
          Check out our blog for tips and tricks on becoming a better
          landlord.&nbsp;
        </p>
      </div>
      <div className="blog-slider">
        <div className="blog-slider__wrp swiper-wrapper">
          <div className="blog-slider__item swiper-slide">
            <div className="blog-slider__img">
              <img src="https://res.cloudinary.com/muhammederdem/image/upload/v1535759872/kuldar-kalvik-799168-unsplash.jpg" />
            </div>
            <div className="blog-slider__content">
              <span className="blog-slider__code">26 December 2019</span>
              <div className="blog-slider__title">
                <p>Lorem Ipsum Dolor</p>
              </div>
              <div className="blog-slider__text">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Recusandae voluptate repellendus magni illo ea animi?
                </p>
              </div>
              <a className="blog-slider__button" href="#">
                READ MORE
              </a>
            </div>
          </div>
          <div className="blog-slider__item swiper-slide">
            <div className="blog-slider__img">
              <img src="https://res.cloudinary.com/muhammederdem/image/upload/v1535759872/kuldar-kalvik-799168-unsplash.jpg" />
            </div>
            <div className="blog-slider__content">
              <span className="blog-slider__code">26 December 2019</span>
              <div className="blog-slider__title">
                <p>Lorem Ipsum Dolor</p>
              </div>
              <div className="blog-slider__text">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Recusandae voluptate repellendus magni illo ea animi?
                </p>
              </div>
              <a className="blog-slider__button" href="#">
                READ MORE
              </a>
            </div>
          </div>
          <div className="blog-slider__item swiper-slide">
            <div className="blog-slider__img">
              <img src="https://res.cloudinary.com/muhammederdem/image/upload/v1535759872/kuldar-kalvik-799168-unsplash.jpg" />
            </div>
            <div className="blog-slider__content">
              <span className="blog-slider__code">26 December 2019</span>
              <div className="blog-slider__title">
                <p>Lorem Ipsum Dolor</p>
              </div>
              <div className="blog-slider__text">
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Recusandae voluptate repellendus magni illo ea animi?
                </p>
              </div>
              <a className="blog-slider__button" href="#">
                READ MORE
              </a>
            </div>
          </div>
        </div>
        <div className="blog-slider__pagination" />
      </div>
    </section>
  );
};

export default Blog;
