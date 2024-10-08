import { Component } from '@builder.io/qwik';
import { CarouselBase, PublicCarouselRootProps } from './root';
import { Carousel } from '@qwik-ui/headless';
import { findComponent, processChildren } from '../../utils/inline-component';

type InternalProps = {
  value?: string;
  /**
   * @deprecated Use `slideComponent` instead.
   */
  carouselSlideComponent?: typeof Carousel.Slide;
  /**
   * @deprecated Use `bulletComponent` instead.
   */
  carouselBulletComponent?: typeof Carousel.Bullet;

  slideComponent?: typeof Carousel.Slide;
  bulletComponent?: typeof Carousel.Bullet;
  stepComponent?: typeof Carousel.Step;
  titleComponent?: typeof Carousel.Title;
};

export const CarouselRoot: Component<PublicCarouselRootProps & InternalProps> = (
  props: PublicCarouselRootProps & InternalProps,
) => {
  const {
    children,
    carouselSlideComponent: GivenSlideOld,
    carouselBulletComponent: GivenBulletOld,
    slideComponent: GivenSlide,
    bulletComponent: GivenBullet,
    stepComponent: GivenStep,
    titleComponent: GivenTitle,
    ...rest
  } = props;
  const Slide = GivenSlide || GivenSlideOld || Carousel.Slide;
  const Bullet = GivenBullet || GivenBulletOld || Carousel.Bullet;
  const Step = GivenStep || Carousel.Step;
  const Title = GivenTitle || Carousel.Title;
  let currSlideIndex = 0;
  let currBulletIndex = 0;
  let currStepIndex = 0;
  let numSlides = 0;
  let isTitle = false;

  // code executes when the item component's shell is "seen"
  findComponent(Slide, (slideProps) => {
    slideProps._index = currSlideIndex;

    currSlideIndex++;
    numSlides++;
  });

  findComponent(Bullet, (bulletProps) => {
    bulletProps._index = currBulletIndex;

    currBulletIndex++;
  });

  findComponent(Step, (stepProps) => {
    stepProps._index = currStepIndex;

    currStepIndex++;
  });

  findComponent(Title, () => {
    isTitle = true;
  });

  processChildren(children);

  return (
    <CarouselBase _numSlides={numSlides} _isTitle={isTitle} {...rest}>
      {props.children}
    </CarouselBase>
  );
};
