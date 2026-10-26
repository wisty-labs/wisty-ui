"use client"

import * as React from "react"
import {
  ArrowUpDownIcon,
  ChartPieIcon,
  ChevronDownIcon,
  Columns2Icon,
  FilterIcon,
  KanbanIcon,
  PencilIcon,
  PinIcon,
  RefreshCwIcon,
  SearchIcon,
  SettingsIcon,
  TableIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icon } from "@/components/wisty/icon"
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderEyebrow,
  PageHeaderFigure,
  PageHeaderHeading,
  PageHeaderMeta,
  PageHeaderRow,
  PageHeaderTitle,
} from "@/components/wisty/page-header"

interface ListViewHeaderView {
  /** The list view's id or API name: "AllOpportunities". */
  value: string
  /** Its name, as the org names it: "All Opportunities". */
  label: string
}

/** One of the list's actions, as a button or a menu item. */
interface ListViewHeaderAction {
  /** Identifies the action in onAction: "new", "import". */
  value: string
  /** The action's name, in title case: "Change Owner". */
  label: string
  /** Shows the action but doesn't let it run. */
  disabled?: boolean
}

type ListViewHeaderDisplay = "table" | "kanban" | "split-view"

/** An item in the List View Controls menu. */
type ListViewHeaderControl =
  | "new"
  | "clone"
  | "rename"
  | "sharing-settings"
  | "edit-list-filters"
  | "select-fields"
  | "reset-column-widths"
  | "reset-column-sorting"
  | "delete"

// List View Controls' items in Lightning's order, grouped as its menu separates them.
const listControls: { value: ListViewHeaderControl; label: string }[][] = [
  [
    { value: "new", label: "New" },
    { value: "clone", label: "Clone" },
    { value: "rename", label: "Rename" },
    { value: "sharing-settings", label: "Sharing Settings" },
  ],
  [
    { value: "edit-list-filters", label: "Edit List Filters" },
    { value: "select-fields", label: "Select Fields to Display" },
    { value: "reset-column-widths", label: "Reset Column Widths" },
    { value: "reset-column-sorting", label: "Reset Column Sorting" },
  ],
  [{ value: "delete", label: "Delete" }],
]

const displays: {
  value: ListViewHeaderDisplay
  label: string
  icon: React.ComponentType
}[] = [
  { value: "table", label: "Table", icon: TableIcon },
  { value: "kanban", label: "Kanban", icon: KanbanIcon },
  { value: "split-view", label: "Split View", icon: Columns2Icon },
]

interface ListViewHeaderProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** The object's icon: "standard:opportunity". */
  icon: React.ComponentProps<typeof Icon>["name"]
  /** The object's label, plural: "Opportunities". */
  objectLabel: string
  /** The list views the switcher offers, shown in the order given (Lightning's is by name). */
  views: ListViewHeaderView[]
  /** The values of the user's recently used list views, most recent first. */
  recentViews?: string[]
  /** The list view shown, by value. */
  view?: string
  /** The list view shown at first, uncontrolled. Default the first view. */
  defaultView?: string
  /** Runs with a list view's value when one is picked. */
  onViewChange?: (view: string) => void
  /** The value of the pinned list view; null when none is pinned. Leave undefined to hide the pin. */
  pinnedView?: string | null
  /** Runs with the view to pin when the pin is pressed, or null to unpin; the pin shows only with it. */
  onPinnedViewChange?: (view: string | null) => void
  /** How many rows the list has. null when it isn't known. */
  itemCount: number | null
  /** More rows exist than `itemCount`, as when only the first 50 loaded. */
  hasMoreItems?: boolean
  /** The field the list is sorted by, as labeled: "Opportunity Name". */
  sortedBy?: string
  /** The filter the list applies, as named: "All opportunities". */
  filteredBy?: string
  /** When the list last updated, as the page writes it: "a few seconds ago". */
  updated?: string
  /** The list's actions, in order. */
  actions?: ListViewHeaderAction[]
  /** How many actions show as buttons; the rest go in the menu. Default 3. */
  visibleActions?: number
  /** Runs with the action that's chosen. */
  onAction?: (action: ListViewHeaderAction) => void
  /** The search text. */
  search?: string
  /** The search text at first, uncontrolled. Default "". */
  defaultSearch?: string
  /** Runs with the search text as it's typed; the search field shows only with it. */
  onSearchChange?: (search: string) => void
  /** How the list displays. */
  display?: ListViewHeaderDisplay
  /** How the list displays at first, uncontrolled. Default "table". */
  defaultDisplay?: ListViewHeaderDisplay
  /** Runs with the display picked; Display as shows only with it. */
  onDisplayChange?: (display: ListViewHeaderDisplay) => void
  /** Runs with the item picked from List View Controls, which shows only with it. */
  onListControl?: (control: ListViewHeaderControl) => void
  /** Runs when Refresh is pressed; the button shows only with it. */
  onRefresh?: () => void
  /** Opens the page's sort dialog from Column sort, which shows only with it. */
  onColumnSort?: () => void
  /** Runs when Edit list is pressed; the button shows only with it. */
  onEditList?: () => void
  /** Runs when Show charts is pressed; the button shows only with it. */
  onShowCharts?: () => void
  /** Runs when Show filters is pressed; the button shows only with it. */
  onShowFilters?: () => void
  /** Squares the bottom corners, for a header that sits on the list below. */
  joined?: boolean
  /** Holds the meta line's place while the list loads. */
  loading?: boolean
  /** A BCP 47 locale for the count. Default "en-US". */
  locale?: string
}

// Controlled when `value` isn't undefined.
function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
) {
  const [own, setOwn] = React.useState(defaultValue)
  const current = value === undefined ? own : value
  const set = (next: T) => {
    if (value === undefined) setOwn(next)
    onChange?.(next)
  }
  return [current, set] as const
}

// The count is left out when it isn't known.
function metaText({
  itemCount,
  hasMoreItems,
  sortedBy,
  filteredBy,
  updated,
  locale,
}: Pick<
  ListViewHeaderProps,
  "itemCount" | "hasMoreItems" | "sortedBy" | "filteredBy" | "updated"
> & { locale: string }) {
  const count =
    itemCount === null
      ? null
      : `${new Intl.NumberFormat(locale).format(itemCount)}${hasMoreItems ? "+" : ""} ${itemCount === 1 && !hasMoreItems ? "item" : "items"}`
  return [
    count,
    sortedBy && `Sorted by ${sortedBy}`,
    filteredBy && `Filtered by ${filteredBy}`,
    updated && `Updated ${updated}`,
  ]
    .filter(Boolean)
    .join(" • ")
}

const iconButton = buttonVariants({ variant: "outline", size: "icon" })
// An icon and a small chevron in one button.
const menuButton = cn(iconButton, "w-auto gap-0.5 px-1.5")

function ListViewHeader({
  icon,
  objectLabel,
  views,
  view: viewProp,
  defaultView,
  onViewChange,
  recentViews = [],
  pinnedView,
  onPinnedViewChange,
  itemCount,
  hasMoreItems = false,
  sortedBy,
  filteredBy,
  updated,
  actions = [],
  visibleActions = 3,
  onAction,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  display: displayProp,
  defaultDisplay = "table",
  onDisplayChange,
  onListControl,
  onRefresh,
  onColumnSort,
  onEditList,
  onShowCharts,
  onShowFilters,
  joined = false,
  loading = false,
  locale = "en-US",
  className,
  ...props
}: ListViewHeaderProps) {
  const [view, setView] = useControllable(
    viewProp,
    defaultView ?? views[0]?.value ?? "",
    onViewChange
  )
  const [search, setSearch] = useControllable(
    searchProp,
    defaultSearch,
    onSearchChange
  )
  const [display, setDisplay] = useControllable(
    displayProp,
    defaultDisplay,
    onDisplayChange
  )
  const [switcherOpen, setSwitcherOpen] = React.useState(false)
  const switcherHint = React.useId()
  const viewLabel = views.find((option) => option.value === view)?.label ?? ""
  const viewGroups = [
    {
      heading: "Recent List Views",
      views: recentViews
        .map((value) => views.find((option) => option.value === value))
        .filter((option) => option !== undefined),
    },
    {
      heading: "All Other Lists",
      views: views.filter((option) => !recentViews.includes(option.value)),
    },
  ].filter((group) => group.views.length > 0)
  const current = displays.find((option) => option.value === display)
  const buttons = actions.slice(0, visibleActions)
  const menu = actions.slice(visibleActions)
  const controls = [
    onSearchChange,
    onListControl,
    onDisplayChange,
    onRefresh,
    onColumnSort,
    onEditList,
    onShowCharts,
    onShowFilters,
  ].some(Boolean)
  const meta = metaText({
    itemCount,
    hasMoreItems,
    sortedBy,
    filteredBy,
    updated,
    locale,
  })

  return (
    <PageHeader
      data-slot="list-view-header"
      joined={joined}
      className={className}
      {...props}
    >
      <PageHeaderRow>
        <PageHeaderFigure>
          <Icon name={icon} />
        </PageHeaderFigure>
        <PageHeaderHeading>
          <PageHeaderEyebrow>{objectLabel}</PageHeaderEyebrow>
          <Popover open={switcherOpen} onOpenChange={setSwitcherOpen}>
            <PageHeaderTitle
              title={viewLabel}
              className="pb-0.5 leading-(--list-view-title-line-height)"
            >
              <PopoverTrigger
                aria-describedby={switcherHint}
                className="inline-flex max-w-full items-center gap-2 text-start leading-(--page-title-line-height) shadow-[inset_0_-1px_0_transparent] outline-none hover:shadow-[inset_0_-1px_0_currentColor] focus-visible:shadow-[inset_0_-1px_0_currentColor] aria-expanded:shadow-[inset_0_-1px_0_currentColor]"
              >
                <span className="truncate">{viewLabel}</span>
                <Icon
                  name="utility:down"
                  size="x-small"
                  className="shrink-0 text-current"
                />
              </PopoverTrigger>
            </PageHeaderTitle>
            <span id={switcherHint} className="sr-only">
              Select a list view
            </span>
            <PopoverContent
              align="start"
              aria-label="List views"
              className="w-[min(36rem,calc(100vw-2rem))] p-0"
            >
              <Command label="Search lists" defaultValue={view}>
                <CommandInput placeholder="Search lists..." />
                <CommandList>
                  <CommandEmpty>No lists found.</CommandEmpty>
                  {viewGroups.map((group) => (
                    <CommandGroup key={group.heading} heading={group.heading}>
                      {group.views.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          keywords={[option.label]}
                          aria-checked={option.value === view}
                          onSelect={(value) => {
                            setView(value)
                            setSwitcherOpen(false)
                          }}
                        >
                          {option.label}
                          {option.value === pinnedView ? " (Pinned list)" : ""}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {pinnedView !== undefined && onPinnedViewChange ? (
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Pin this list view"
              aria-pressed={pinnedView === view}
              className="mb-(--page-header-switcher-offset) aria-pressed:[&_svg]:fill-current"
              onClick={() =>
                onPinnedViewChange(pinnedView === view ? null : view)
              }
            >
              <PinIcon />
            </Button>
          ) : null}
        </PageHeaderHeading>
        {actions.length > 0 ? (
          <PageHeaderActions className="pb-1">
            <ButtonGroup aria-label={`${objectLabel} actions`}>
              {buttons.map((action) => (
                <Button
                  key={action.value}
                  variant="outline"
                  disabled={action.disabled}
                  onClick={() => onAction?.(action)}
                >
                  {action.label}
                </Button>
              ))}
              {menu.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="More actions"
                    className={iconButton}
                  >
                    <ChevronDownIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {menu.map((action) => (
                      <DropdownMenuItem
                        key={action.value}
                        disabled={action.disabled}
                        onClick={() => onAction?.(action)}
                      >
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </ButtonGroup>
          </PageHeaderActions>
        ) : null}
      </PageHeaderRow>
      <PageHeaderRow aria-busy={loading || undefined}>
        {loading ? (
          <div className="min-w-0 flex-1 basis-48">
            <Skeleton
              data-loading=""
              className="my-[calc((var(--line-height-base)-1)*0.5em)] h-[1em] w-64 max-w-full bg-container"
            />
          </div>
        ) : (
          <PageHeaderMeta>{meta}</PageHeaderMeta>
        )}
        {controls ? (
          <TooltipProvider>
            <PageHeaderActions>
              {onSearchChange ? (
                <InputGroup className="w-56 max-w-full">
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="search"
                    aria-label="Search this list"
                    placeholder="Search this list..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </InputGroup>
              ) : null}
              {onListControl ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="List View Controls"
                    className={menuButton}
                  >
                    <SettingsIcon />
                    <ChevronDownIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {listControls.map((group, index) => (
                      <React.Fragment key={group[0]!.value}>
                        {index > 0 ? <DropdownMenuSeparator /> : null}
                        <DropdownMenuGroup>
                          {group.map((control) => (
                            <DropdownMenuItem
                              key={control.value}
                              variant={
                                control.value === "delete"
                                  ? "destructive"
                                  : "default"
                              }
                              onClick={() => onListControl(control.value)}
                            >
                              {control.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </React.Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
              {onDisplayChange ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label={`Display as ${current?.label ?? ""}`}
                    className={menuButton}
                  >
                    {current ? <current.icon /> : null}
                    <ChevronDownIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Display as</DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={display}
                        onValueChange={(value) =>
                          setDisplay(value as ListViewHeaderDisplay)
                        }
                      >
                        {displays.map((option) => (
                          <DropdownMenuRadioItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
              {onRefresh ? (
                <Tooltip>
                  <TooltipTrigger
                    aria-label="Refresh"
                    className={iconButton}
                    onClick={onRefresh}
                  >
                    <RefreshCwIcon />
                  </TooltipTrigger>
                  <TooltipContent>Refresh</TooltipContent>
                </Tooltip>
              ) : null}
              {onColumnSort ? (
                <Tooltip>
                  <TooltipTrigger
                    aria-label="Column sort"
                    className={iconButton}
                    onClick={onColumnSort}
                  >
                    <ArrowUpDownIcon />
                  </TooltipTrigger>
                  <TooltipContent>Column sort</TooltipContent>
                </Tooltip>
              ) : null}
              {onEditList ? (
                <Tooltip>
                  <TooltipTrigger
                    aria-label="Edit list"
                    className={iconButton}
                    onClick={onEditList}
                  >
                    <PencilIcon />
                  </TooltipTrigger>
                  <TooltipContent>Edit list</TooltipContent>
                </Tooltip>
              ) : null}
              {onShowCharts || onShowFilters ? (
                <ButtonGroup aria-label="List panels">
                  {onShowCharts ? (
                    <Tooltip>
                      <TooltipTrigger
                        aria-label="Show charts"
                        className={iconButton}
                        onClick={onShowCharts}
                      >
                        <ChartPieIcon />
                      </TooltipTrigger>
                      <TooltipContent>Show charts</TooltipContent>
                    </Tooltip>
                  ) : null}
                  {onShowFilters ? (
                    <Tooltip>
                      <TooltipTrigger
                        aria-label="Show filters"
                        className={iconButton}
                        onClick={onShowFilters}
                      >
                        <FilterIcon />
                      </TooltipTrigger>
                      <TooltipContent>Show filters</TooltipContent>
                    </Tooltip>
                  ) : null}
                </ButtonGroup>
              ) : null}
            </PageHeaderActions>
          </TooltipProvider>
        ) : null}
      </PageHeaderRow>
    </PageHeader>
  )
}

export { ListViewHeader }
export type {
  ListViewHeaderAction,
  ListViewHeaderControl,
  ListViewHeaderDisplay,
  ListViewHeaderProps,
  ListViewHeaderView,
}
