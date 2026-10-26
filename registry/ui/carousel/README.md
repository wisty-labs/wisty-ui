# Carousel

This page shows the Radix version. Base UI projects get [registry/base/ui/carousel.tsx](../../base/ui/carousel.tsx), and [ui.wisty.ai/carousel](https://ui.wisty.ai/carousel) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Shows one image panel at a time, with dots or arrows to move between them.

```bash
npx shadcn@latest add @wisty/carousel
```

## Examples

- `default` (Announcements): Three panels, each an image with a title and a line under it, and dots below that pick a panel. The dots read the carousel through `setApi`.
- `autoplay` (Autoplay): Moves to the next panel every five seconds, with a button that stops and starts it. Under reduced motion it waits for the button.
- `previous-next` (Previous and next): Arrow buttons on each side, from `CarouselPrevious` and `CarouselNext`, and no dots.

## When to use

- To show a few announcements, promotions or featured articles in one spot, one at a time, as on an Experience Cloud or app home page. It replaces `lightning-carousel` and `lightning-carousel-image`.
- Each panel is an image with a short title and a line under it, and may link somewhere.
- Three to five panels. People rarely look past the first few.

## When not to use

- People need to compare the items or read them all. Show them side by side in a grid of Cards, or in a list with Item.
- The panels are sections of one record or page. Use Tabs.
- The content is wider than its box and people just need to scroll it. Use Scroll Area.
- Anything people must not miss. A panel that isn't showing is easy to skip, so put it on the page or in an Alert.

## Usage

```text
Carousel
├── CarouselContent
│   └── CarouselItem
├── CarouselPrevious
└── CarouselNext
```

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
```

```tsx
<Carousel aria-label="Featured articles">
  <CarouselContent>
    <CarouselItem>{/* first panel */}</CarouselItem>
    <CarouselItem>{/* second panel */}</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

Dots and an autoplay button aren't parts: draw them beside the carousel from its API, as the examples do. `setApi` hands you the carousel's API once it's ready; read the shown panel with `selectedScrollSnap()` and listen for `"select"`. Pass a function that keeps its identity, a state setter or one wrapped in `useCallback`, since the carousel calls it again whenever it changes.

```tsx
const onApi = useCallback((api: CarouselApi) => {
  api?.on("select", () => setCurrent(api.selectedScrollSnap()))
}, [])
```

`opts` passes options to the carousel, like `loop`, and `plugins` adds behavior. Autoplay is the `embla-carousel-autoplay` plugin, which you add to the project yourself (`pnpm add embla-carousel-autoplay`).

## Rules

- Don't autoplay without a button that stops it, and keep the reduced-motion options from the example.
- Pass `setApi` a function that keeps its identity, or the carousel subscribes again on every render.
- Keep `CarouselItem`s as the direct children of `CarouselContent`. The carousel moves exactly those.
- Draw panels and dots with the `--carousel-*` tokens, not literal colors or radii: they change per theme.

## API reference

| Part | Built on |
| --- | --- |
| `Carousel` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `CarouselContent` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `CarouselItem` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |
| `CarouselPrevious` | [Button](https://ui.wisty.ai/button#api-Button) |
| `CarouselNext` | [Button](https://ui.wisty.ai/button#api-Button) |

### Carousel

| Prop | Type | Default |
| --- | --- | --- |
| `opts`? | `CarouselOptions` |  |
| `plugins`? | `CarouselPlugin` |  |
| `orientation`? | `"horizontal" \| "vertical"` | `"horizontal"` |
| `setApi`? | `(api: CarouselApi) => void` |  |

### CarouselPrevious

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "outline" \| "secondary" \| "ghost" \| "destructive" \| "link" \| "outline-brand" \| "destructive-text" \| "success" \| "inverse"` | `"outline"` |
| `size`? | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"icon-sm"` |

### CarouselNext

| Prop | Type | Default |
| --- | --- | --- |
| `variant`? | `"default" \| "outline" \| "secondary" \| "ghost" \| "destructive" \| "link" \| "outline-brand" \| "destructive-text" \| "success" \| "inverse"` | `"outline"` |
| `size`? | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"icon-sm"` |

### useCarousel

Returns `CarouselContextProps`.

### CarouselApi

```ts
type CarouselApi = UseEmblaCarouselType[1]
```

### CarouselOptions

```ts
type CarouselOptions = UseCarouselParameters[0]
```

### CarouselPlugin

```ts
type CarouselPlugin = UseCarouselParameters[1]
```

### CarouselContextProps

```ts
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps
```

## SLDS mapping

`Carousel` is `slds-carousel` and its `slds-carousel__stage`, `CarouselContent` the `slds-carousel__panels` that move, and `CarouselItem` an `slds-carousel__panel`. The examples draw the rest from the `--carousel-*` tokens: the bordered panel (`slds-carousel__panel-action`) with its image (`slds-carousel__image`) and text (`slds-carousel__content`, `slds-carousel__content-title`), the dots (`slds-carousel__indicators`, `slds-carousel__indicator-action`, with `aria-selected` doing the job of `slds-is-active`) and the autoplay button (`slds-carousel__autoplay`).

Known gaps:

- No dots or autoplay button as parts. Copy them from the examples.
- SLDS has no previous and next buttons; `CarouselPrevious` and `CarouselNext` are bordered icon buttons outside the panels.
- SLDS moves panels sideways only, so `orientation="vertical"` has no SLDS look.
- The autoplay button is 24px, where SLDS's is 20px (`slds-button_icon-x-small`).

## Keyboard interactions

| Keys                    | Action                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Right Arrow, Left Arrow | Anywhere in the carousel, shows the next or previous panel. They stop at the ends unless `opts` sets `loop`. |
| Tab                     | Moves through the autoplay button, the shown panel's link and the selected dot, in that order.               |
| Enter, Space            | On a dot, shows its panel. On the autoplay button, stops or starts it.                                       |

The arrows are Left and Right in a vertical carousel too. In the examples they also move focus to the newly selected dot, so focus never stays on a panel that has just been hidden.

## Accessibility

- Name the carousel with `aria-label` on `Carousel`. It's a region with the role description "carousel", and each `CarouselItem` a group described as "slide": give each one an `aria-label` like "2 of 3".
- With dots, make them a `tablist` of `tab`s with `aria-selected`, `aria-controls` and a roving `tabIndex`, and each `CarouselItem` a `tabpanel` labelled by its dot, as the first example does. Set `inert` on the panels that aren't showing, so neither Tab nor a screen reader reaches them.
- Give every dot an `aria-label`, like its panel's title: a dot has no text.
- An autoplay button comes first in the carousel, before the panels, and says what it will do: "Stop autoplay" while playing, "Start autoplay" while stopped. Don't add `aria-pressed` to a label that changes.
- Autoplay stops for good once someone drags a panel or focuses one, and stays stopped until they press the button.
- When a panel's title says everything its image does, give the image `alt=""`. Otherwise describe it.

## Motion

- Panels slide when they change, from the arrows, the dots, a drag or autoplay. Reduced motion doesn't change that slide.
- The autoplay example doesn't start by itself under reduced motion, and once started from its button it jumps between panels instead of sliding (the plugin's `breakpoints`, with `playOnInit: false` and `jump: true`). Keep both if you change the plugin's options.

## Responsive behavior

- The carousel fills its container's width and each panel takes all of it. Set a `max-w-*` on `Carousel`.
- `CarouselPrevious` and `CarouselNext` sit 3rem outside the panels, so leave that room on both sides or move them with `className`.

## Example code

### Announcements

Three panels, each an image with a title and a line under it, and dots below that pick a panel. The dots read the carousel through `setApi`.

```tsx
"use client"

import { useCallback, useId, useState, type KeyboardEvent } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

const slides = [
  {
    title: "Spring release webinar",
    description: "Join the product team on May 14 for a live tour.",
    href: "/events/spring-release",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%237f8de1'/%3E%3Ccircle cx='480' cy='110' r='48' fill='%23fff' fill-opacity='.7'/%3E%3Cpath d='M0 360 200 150l120 110 90-70 230 170z' fill='%23fff' fill-opacity='.55'/%3E%3C/svg%3E",
  },
  {
    title: "A new help center",
    description: "Open cases and follow their progress in one place.",
    href: "/help",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%2352b5ae'/%3E%3Ccircle cx='160' cy='100' r='40' fill='%23fff' fill-opacity='.7'/%3E%3Cpath d='M0 360 140 220l110 60 160-150 230 230z' fill='%23fff' fill-opacity='.55'/%3E%3C/svg%3E",
  },
  {
    title: "Customer awards",
    description: "Nominate a team for this year's awards by June 30.",
    href: "/awards",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23b18ad9'/%3E%3Ccircle cx='320' cy='90' r='44' fill='%23fff' fill-opacity='.7'/%3E%3Cpath d='M0 360 170 190l150 120 120-90 200 140z' fill='%23fff' fill-opacity='.55'/%3E%3C/svg%3E",
  },
]

export default function CarouselDefault() {
  const id = useId()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const onApi = useCallback((api: CarouselApi) => {
    if (!api) return
    setApi(api)
    api.on("select", () => setCurrent(api.selectedScrollSnap()))
  }, [])

  function focusSelectedDot(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    document.getElementById(`${id}-dot-${api?.selectedScrollSnap()}`)?.focus()
  }

  return (
    <Carousel
      setApi={onApi}
      onKeyDown={focusSelectedDot}
      aria-label="Announcements"
      className="w-full max-w-md text-(--carousel-foreground)"
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem
            key={slide.href}
            id={`${id}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${id}-dot-${index}`}
            inert={index !== current}
          >
            <a
              href={slide.href}
              className="m-1 block overflow-hidden rounded-(--carousel-radius) border outline-hidden focus-visible:shadow-(--shadow-focus-outset)"
            >
              <img
                src={slide.image}
                alt=""
                className="aspect-video w-full object-cover"
              />
              <div className="h-26.5 overflow-y-auto bg-(--carousel-surface) p-4 text-center">
                <h2 className="text-(length:--carousel-title-size) font-(--carousel-title-weight)">
                  {slide.title}
                </h2>
                <p>{slide.description}</p>
              </div>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div
        role="tablist"
        aria-label="Choose an announcement"
        className="my-2 flex justify-center gap-2"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.href}
            type="button"
            role="tab"
            id={`${id}-dot-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={index === current}
            aria-label={slide.title}
            tabIndex={index === current ? 0 : -1}
            onClick={() => api?.scrollTo(index)}
            className="size-4 rounded-full border border-border-strong bg-(--carousel-surface) outline-hidden hover:not-aria-selected:not-focus-visible:bg-(--carousel-indicator-hover) aria-selected:not-focus-visible:border-(--carousel-indicator-active) aria-selected:not-focus-visible:bg-(--carousel-indicator-active) aria-selected:not-focus-visible:shadow-(--carousel-indicator-shadow-active) focus-visible:border-(--carousel-indicator-border-focus) focus-visible:bg-(--carousel-indicator-focus) focus-visible:shadow-(--shadow-focus-outset)"
          />
        ))}
      </div>
    </Carousel>
  )
}
```

### Autoplay

Moves to the next panel every five seconds, with a button that stops and starts it. Under reduced motion it waits for the button.

```tsx
"use client"

import { useCallback, useId, useState, type KeyboardEvent } from "react"
import Autoplay from "embla-carousel-autoplay"
import { PauseIcon, PlayIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"

const slides = [
  {
    title: "Spring release webinar",
    description: "Join the product team on May 14 for a live tour.",
    href: "/events/spring-release",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%237f8de1'/%3E%3Ccircle cx='480' cy='110' r='48' fill='%23fff' fill-opacity='.7'/%3E%3Cpath d='M0 360 200 150l120 110 90-70 230 170z' fill='%23fff' fill-opacity='.55'/%3E%3C/svg%3E",
  },
  {
    title: "A new help center",
    description: "Open cases and follow their progress in one place.",
    href: "/help",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%2352b5ae'/%3E%3Ccircle cx='160' cy='100' r='40' fill='%23fff' fill-opacity='.7'/%3E%3Cpath d='M0 360 140 220l110 60 160-150 230 230z' fill='%23fff' fill-opacity='.55'/%3E%3C/svg%3E",
  },
  {
    title: "Customer awards",
    description: "Nominate a team for this year's awards by June 30.",
    href: "/awards",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23b18ad9'/%3E%3Ccircle cx='320' cy='90' r='44' fill='%23fff' fill-opacity='.7'/%3E%3Cpath d='M0 360 170 190l150 120 120-90 200 140z' fill='%23fff' fill-opacity='.55'/%3E%3C/svg%3E",
  },
]

export default function CarouselAutoplay() {
  const id = useId()
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 5000,
      breakpoints: {
        "(prefers-reduced-motion: reduce)": { playOnInit: false, jump: true },
      },
    })
  )

  const onApi = useCallback(
    (api: CarouselApi) => {
      if (!api) return
      setApi(api)
      setPlaying(autoplay.isPlaying())
      api.on("select", () => setCurrent(api.selectedScrollSnap()))
      api.on("autoplay:play", () => setPlaying(true))
      api.on("autoplay:stop", () => setPlaying(false))
    },
    [autoplay]
  )

  function focusSelectedDot(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    document.getElementById(`${id}-dot-${api?.selectedScrollSnap()}`)?.focus()
  }

  return (
    <Carousel
      setApi={onApi}
      plugins={[autoplay]}
      onKeyDown={focusSelectedDot}
      aria-label="Announcements"
      className="w-full max-w-md text-(--carousel-foreground)"
    >
      <Button
        variant="outline"
        size="icon-xs"
        aria-label={playing ? "Stop autoplay" : "Start autoplay"}
        onClick={() => (playing ? autoplay.stop() : autoplay.play())}
        className="absolute bottom-1 left-1 z-10"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem
            key={slide.href}
            id={`${id}-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`${id}-dot-${index}`}
            inert={index !== current}
          >
            <a
              href={slide.href}
              className="m-1 block overflow-hidden rounded-(--carousel-radius) border outline-hidden focus-visible:shadow-(--shadow-focus-outset)"
            >
              <img
                src={slide.image}
                alt=""
                className="aspect-video w-full object-cover"
              />
              <div className="h-26.5 overflow-y-auto bg-(--carousel-surface) p-4 text-center">
                <h2 className="text-(length:--carousel-title-size) font-(--carousel-title-weight)">
                  {slide.title}
                </h2>
                <p>{slide.description}</p>
              </div>
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div
        role="tablist"
        aria-label="Choose an announcement"
        className="my-2 flex justify-center gap-2"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.href}
            type="button"
            role="tab"
            id={`${id}-dot-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={index === current}
            aria-label={slide.title}
            tabIndex={index === current ? 0 : -1}
            onClick={() => api?.scrollTo(index)}
            className="size-4 rounded-full border border-border-strong bg-(--carousel-surface) outline-hidden hover:not-aria-selected:not-focus-visible:bg-(--carousel-indicator-hover) aria-selected:not-focus-visible:border-(--carousel-indicator-active) aria-selected:not-focus-visible:bg-(--carousel-indicator-active) aria-selected:not-focus-visible:shadow-(--carousel-indicator-shadow-active) focus-visible:border-(--carousel-indicator-border-focus) focus-visible:bg-(--carousel-indicator-focus) focus-visible:shadow-(--shadow-focus-outset)"
          />
        ))}
      </div>
    </Carousel>
  )
}
```

### Previous and next

Arrow buttons on each side, from `CarouselPrevious` and `CarouselNext`, and no dots.

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const slides = [
  {
    title: "Downtown store",
    description: "Open every day from 9 AM to 8 PM.",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%237f8de1'/%3E%3Ccircle cx='480' cy='110' r='48' fill='%23fff' fill-opacity='.7'/%3E%3Cpath d='M0 360 200 150l120 110 90-70 230 170z' fill='%23fff' fill-opacity='.55'/%3E%3C/svg%3E",
  },
  {
    title: "Harbor store",
    description: "Open Monday to Saturday from 10 AM to 6 PM.",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%2352b5ae'/%3E%3Ccircle cx='160' cy='100' r='40' fill='%23fff' fill-opacity='.7'/%3E%3Cpath d='M0 360 140 220l110 60 160-150 230 230z' fill='%23fff' fill-opacity='.55'/%3E%3C/svg%3E",
  },
  {
    title: "Airport store",
    description: "Open every day from 6 AM to 10 PM, past security.",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%23b18ad9'/%3E%3Ccircle cx='320' cy='90' r='44' fill='%23fff' fill-opacity='.7'/%3E%3Cpath d='M0 360 170 190l150 120 120-90 200 140z' fill='%23fff' fill-opacity='.55'/%3E%3C/svg%3E",
  },
]

export default function CarouselPreviousNext() {
  return (
    <Carousel
      aria-label="Store locations"
      className="w-full max-w-xs text-(--carousel-foreground)"
    >
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem
            key={slide.title}
            aria-label={`${index + 1} of ${slides.length}`}
          >
            <div className="m-1 overflow-hidden rounded-(--carousel-radius) border">
              <img
                src={slide.image}
                alt=""
                className="aspect-video w-full object-cover"
              />
              <div className="h-26.5 overflow-y-auto bg-(--carousel-surface) p-4 text-center">
                <h2 className="text-(length:--carousel-title-size) font-(--carousel-title-weight)">
                  {slide.title}
                </h2>
                <p>{slide.description}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
```
