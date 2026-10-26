# Page regions

One file serves Radix and Base UI projects. This page shows the Radix examples; [ui.wisty.ai/page-regions](https://ui.wisty.ai/page-regions) shows both. Install it with the shadcn CLI once `@wisty` is in your components.json ([installation](https://ui.wisty.ai/docs/installation)).

Gives a page the layout of a Lightning page template: a header, then regions. The template sets the columns and where they stack.

```bash
npx shadcn@latest add @wisty/page-regions
```

## Examples

- `default` (Record page): Lightning's default record page template, Header and Right Sidebar: a page header, then the main region two thirds wide with the sidebar beside it.
- `left-sidebar` (Header and Left Sidebar): The sidebar before the main region, with `layout="left-sidebar"`.
- `two-equal` (Header and Two Equal Regions): Two regions of the same width, with `layout="two-equal"`, as a home page's Today's Tasks and Today's Events.
- `three` (Header and Three Regions): Three regions of the same width, with `layout="three"`, stacked one under the other below 64rem.
- `one` (Header and One Region): One region the full width of the page, with `layout="one"`, for cards stacked one under the other.

## When to use

- To lay a page out the way Lightning's page templates do: a header, then one, two or three regions of cards and lists. `layout` names the template.
- For a record page, an app page or a home page in an app, before its sections go in. For a record page with its sections already in place, start from Record page.
- When every page should agree on the sidebar's width, the gap between regions and where they stack.

## When not to use

- For the sections themselves. Put Record header, Related list, Record detail, Activity timeline or KPI row in a region.
- For a whole record page. Record page is built on these parts. Copy it and change its lines.
- For columns inside a card or a form. Use a grid on the card's content, or Field group's layout.

## Usage

```text
Page
├── (a header: Page header, Record header or List view header)
├── (a path or a subheader)
└── PageRegions
    ├── PageRegion
    └── PageRegion
```

```tsx
import { Page, PageRegion, PageRegions } from "@/components/wisty/page-regions"
```

```tsx
<Page>
  <RecordHeader
    icon="standard:account"
    objectLabel="Account"
    name="Edge Communications"
  />
  <PageRegions layout="right-sidebar">
    <PageRegion>
      <Card>…</Card>
    </PageRegion>
    <PageRegion>
      <Card>…</Card>
    </PageRegion>
  </PageRegions>
</Page>
```

Whatever spans the page, a header, a path or a subheader, is a child of `Page` before `PageRegions`. The regions are `PageRegions`' children in order: for `right-sidebar` the sidebar is the second region, for `left-sidebar` the first, and `three` takes three. Each `PageRegion` stacks what's put in it.

## Rules

- Put `PageRegions` inside `Page`. The columns come from the page's width, and outside `Page` the regions stay stacked.
- Give `PageRegions` as many regions as its layout has: two for a sidebar layout or `two-equal`, three for `three`, one for `one`. A region past that starts a new row.
- Keep the sidebar's content to what fits 22rem: a KPI row two by two, tiles, a timeline. A table in a sidebar shows tiles.
- Never pass `asChild` or `render`.

## API reference

| Part | Built on | Description |
| --- | --- | --- |
| `Page` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) | A page laid out as a Lightning page template: a header, then its regions. |
| `PageRegions` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |  |
| `PageRegion` | [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/div) |  |

### PageRegions

| Prop | Type | Default |
| --- | --- | --- |
| `layout`? | `"one" \| "right-sidebar" \| "left-sidebar" \| "two-equal" \| "three"` | `"right-sidebar"` |

## SLDS mapping

Lightning's page templates are the runtime's, not markup, so SLDS draws their regions with its grid. `Page` is the template's container, `PageRegions` is `slds-grid slds-wrap`, and each `PageRegion` is an `slds-col` with `slds-size_1-of-1` and the responsive size the table lists for its layout. The table maps every layout.

Known gaps:

- SLDS's `slds-gutters` put 24px between columns. The regions sit 16px apart, the space between stacked cards.
- Subheader and grouped-header templates have no `layout`: a subheader is one more child of `Page` under the header, and a grouped header is the page's own header.

## Accessibility

- `Page` is a `div`, not `main`. The app's layout provides the main landmark, so a page sits inside it.
- The parts have no roles or names. Landmarks and headings come from what's in the regions: a related list is a named region, a header's title is the h1.

## Responsive behavior

- The regions follow the page's own width, not the window's: a page in a split view stacks sooner than one that fills the window.
- `right-sidebar` and `left-sidebar` take two columns from 54rem, the main region two thirds and the sidebar one third, never narrower than 22rem. Below 54rem the regions stack in their order.
- `two-equal` takes two columns from 48rem, `three` three columns from 64rem; below that each stacks in order. `one` is one column at every width.
- What's in a region sizes to its column: a related list shows tiles once its column is narrower than 30rem.

## Example code

### Record page

Lightning's default record page template, Header and Right Sidebar: a page header, then the main region two thirds wide with the sidebar beside it.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icon } from "@/components/wisty/icon"
import {
  PageHeader,
  PageHeaderEyebrow,
  PageHeaderFigure,
  PageHeaderHeading,
  PageHeaderRow,
  PageHeaderTitle,
} from "@/components/wisty/page-header"
import { Page, PageRegion, PageRegions } from "@/components/wisty/page-regions"

export default function PageRegionsDefault() {
  return (
    <Page>
      <PageHeader>
        <PageHeaderRow>
          <PageHeaderFigure>
            <Icon name="standard:account" />
          </PageHeaderFigure>
          <PageHeaderHeading>
            <PageHeaderEyebrow>Account</PageHeaderEyebrow>
            <PageHeaderTitle>Edge Communications</PageHeaderTitle>
          </PageHeaderHeading>
        </PageHeaderRow>
      </PageHeader>
      <PageRegions layout="right-sidebar">
        <PageRegion>
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              The page layout's fields, in their sections.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Related</CardTitle>
            </CardHeader>
            <CardContent>Contacts, Opportunities and Cases.</CardContent>
          </Card>
        </PageRegion>
        <PageRegion>
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              Upcoming and past tasks, events and calls.
            </CardContent>
          </Card>
        </PageRegion>
      </PageRegions>
    </Page>
  )
}
```

### Header and Left Sidebar

The sidebar before the main region, with `layout="left-sidebar"`.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Page, PageRegion, PageRegions } from "@/components/wisty/page-regions"

export default function PageRegionsLeftSidebar() {
  return (
    <Page>
      <PageRegions layout="left-sidebar">
        <PageRegion>
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              Upcoming and past tasks, events and calls.
            </CardContent>
          </Card>
        </PageRegion>
        <PageRegion>
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              The page layout's fields, in their sections.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Related</CardTitle>
            </CardHeader>
            <CardContent>Contacts, Opportunities and Cases.</CardContent>
          </Card>
        </PageRegion>
      </PageRegions>
    </Page>
  )
}
```

### Header and Two Equal Regions

Two regions of the same width, with `layout="two-equal"`, as a home page's Today's Tasks and Today's Events.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Page, PageRegion, PageRegions } from "@/components/wisty/page-regions"

export default function PageRegionsTwoEqual() {
  return (
    <Page>
      <PageRegions layout="two-equal">
        <PageRegion>
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
            </CardHeader>
            <CardContent>Three tasks are due today.</CardContent>
          </Card>
        </PageRegion>
        <PageRegion>
          <Card>
            <CardHeader>
              <CardTitle>Today's Events</CardTitle>
            </CardHeader>
            <CardContent>
              Installation planning meeting at 10:00 AM.
            </CardContent>
          </Card>
        </PageRegion>
      </PageRegions>
    </Page>
  )
}
```

### Header and Three Regions

Three regions of the same width, with `layout="three"`, stacked one under the other below 64rem.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Page, PageRegion, PageRegions } from "@/components/wisty/page-regions"

export default function PageRegionsThree() {
  return (
    <Page>
      <PageRegions layout="three">
        <PageRegion>
          <Card>
            <CardHeader>
              <CardTitle>Key Deals</CardTitle>
            </CardHeader>
            <CardContent>
              Edge Emergency Generator closes in November.
            </CardContent>
          </Card>
        </PageRegion>
        <PageRegion>
          <Card>
            <CardHeader>
              <CardTitle>Recent Records</CardTitle>
            </CardHeader>
            <CardContent>
              Edge Communications, Rose Gonzalez, 00001026.
            </CardContent>
          </Card>
        </PageRegion>
        <PageRegion>
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
            </CardHeader>
            <CardContent>Three tasks are due today.</CardContent>
          </Card>
        </PageRegion>
      </PageRegions>
    </Page>
  )
}
```

### Header and One Region

One region the full width of the page, with `layout="one"`, for cards stacked one under the other.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Page, PageRegion, PageRegions } from "@/components/wisty/page-regions"

export default function PageRegionsOne() {
  return (
    <Page>
      <PageRegions layout="one">
        <PageRegion>
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              $185K closed of a $250K goal, with $75K open.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              Two opportunities have no activity in 30 days.
            </CardContent>
          </Card>
        </PageRegion>
      </PageRegions>
    </Page>
  )
}
```
