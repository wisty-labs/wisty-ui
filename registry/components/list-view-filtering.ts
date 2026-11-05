/** A filterable field's kind, which decides its operators and its value's type. */
export type ListViewFilterType =
  | "text"
  | "picklist"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "boolean"

/** Operators every kind of field takes. */
export type ListViewFilterEqualityOperator = "equals" | "not-equal"

/** Operators a text field takes. */
export type ListViewFilterTextOperator =
  | ListViewFilterEqualityOperator
  | "contains"
  | "not-contains"
  | "starts-with"

/** Operators a number, currency, percent or date field takes. */
export type ListViewFilterRangeOperator =
  | ListViewFilterEqualityOperator
  | "less-than"
  | "greater-than"
  | "less-or-equal"
  | "greater-or-equal"

/** Every operator a filter can use. */
export type ListViewFilterOperator =
  | ListViewFilterTextOperator
  | ListViewFilterRangeOperator

/** A picklist value and its label. */
export type ListViewFilterOption = {
  /** What the records hold. */
  value: string
  /** What the panel shows. */
  label: string
}

type ListViewFilterFieldBase<Row, Value> = {
  /** Unique among the fields. Saved filters name their field by it: "Type". */
  id: string
  /** The field's label: "Account Type". */
  label: string
  /** The operators people may pick, narrowed from the ones the kind takes. Default: all of them. */
  operators?: readonly ListViewFilterOperator[]
  /** Lets equals and not equal to match a blank value. Default false. */
  nullable?: boolean
  /** Reads the field from a row: null when it's blank, undefined when it wasn't read. */
  read: (row: Row) => Value | null | undefined
}

/** A field people can filter by: its id, label, kind and reader, as the page allows it. */
export type ListViewFilterField<Row> =
  | (ListViewFilterFieldBase<Row, string> & {
      /** Free text, compared without case unless caseSensitive. */
      type: "text"
      /** Compares text with its case. Default false. */
      caseSensitive?: boolean
    })
  | (ListViewFilterFieldBase<Row, string> & {
      /** One value from a list. */
      type: "picklist"
      /** The values people pick from, in order. */
      options: readonly ListViewFilterOption[]
    })
  | (ListViewFilterFieldBase<Row, number> & {
      /** A number. */
      type: "number"
    })
  | (ListViewFilterFieldBase<Row, number> & {
      /** An amount in one currency. */
      type: "currency"
      /** The ISO 4217 code amounts are in, for showing them. Default "USD". */
      currencyCode?: string
    })
  | (ListViewFilterFieldBase<Row, number> & {
      /** A fraction shown as a percent: 0.35 is 35%. */
      type: "percent"
    })
  | (ListViewFilterFieldBase<Row, string> & {
      /** A day, as "YYYY-MM-DD". */
      type: "date"
      /** The day the calendar marks as today, as "YYYY-MM-DD". Default: the browser's today. */
      today?: string
    })
  | (ListViewFilterFieldBase<Row, boolean> & {
      /** True or false. */
      type: "boolean"
    })

/** One criterion: a field, an operator and a typed value. null is an intentional blank. */
export type ListViewFilterCondition =
  | {
      field: string
      type: "text"
      operator: ListViewFilterTextOperator
      value: string | null
    }
  | {
      field: string
      type: "picklist"
      operator: ListViewFilterEqualityOperator
      value: string | null
    }
  | {
      field: string
      type: "number"
      operator: ListViewFilterRangeOperator
      value: number | null
    }
  | {
      field: string
      type: "currency"
      operator: ListViewFilterRangeOperator
      value: number | null
    }
  | {
      field: string
      type: "percent"
      operator: ListViewFilterRangeOperator
      value: number | null
    }
  | {
      field: string
      type: "date"
      operator: ListViewFilterRangeOperator
      value: string | null
    }
  | {
      field: string
      type: "boolean"
      operator: ListViewFilterEqualityOperator
      value: boolean | null
    }

/** A filter the page applies that people can see but not change or remove. */
export type ListViewLockedFilter = {
  /** Unique among the locked filters. */
  key: string
  /** What the filter matches. */
  condition: ListViewFilterCondition
  /** Why it's locked, shown under it: "This view shows open cases only." */
  reason: string
}

/** A list view's saved filters, as Save hands them over. */
export type ListViewFiltersValue = {
  /** Everyone's records, or the signed-in user's. */
  owner: "all" | "mine"
  /** The filters people can change, numbered from 1 by position for filter logic. */
  filters: readonly ListViewFilterCondition[]
  /** How the filters combine, as "1 AND (2 OR 3)". null matches all of them. */
  logic: string | null
}

/** Filter by Owner: whose records are "mine", and the two choices' words. */
export type ListViewFilterOwner<Row> = {
  /** The choice for everyone's records: "All accounts". */
  allLabel: string
  /** The choice for the signed-in user's records: "My accounts". */
  mineLabel: string
  /** The signed-in user's id. Without it, "mine" can't be applied. */
  currentUserId: string | null | undefined
  /** Reads a row's owner id: null when it has none, undefined when it wasn't read. */
  read: (row: Row) => string | null | undefined
}

/** What people may filter by, as the page allows it. */
export type ListViewFilterSchema<Row> = {
  /** The fields people can filter by, in the order the field menu lists them. */
  fields: readonly ListViewFilterField<Row>[]
  /** Shows Filter by Owner. Leave it out for records without owners. */
  owner?: ListViewFilterOwner<Row>
  /** Filters that always apply, ANDed with everything else. */
  lockedFilters?: readonly ListViewLockedFilter[]
}

/** Why filters can't be applied, or rows the filters couldn't check. */
export type ListViewFilterIssue = {
  /** What the issue is about. */
  scope: "schema" | "owner" | "filter" | "locked" | "logic" | "data"
  /** The issue in words, for people. */
  message: string
  /** The editable filter it's about, by its number: its position from 1. */
  filterNumber?: number
  /** The locked filter it's about. */
  lockedKey?: string
  /** The field it's about. */
  fieldId?: string
}

type ListViewFilterResultBase = {
  /** Every filter's field label in order, locked first, or undefined with no filters. */
  filteredBy: string | undefined
}

/** The rows saved filters keep. Unavailable and invalid never mean zero matches. */
export type ListViewFilterResult<Row> =
  | (ListViewFilterResultBase & {
      /** Every row was checked. */
      status: "ready"
      /** The rows that match, in their order. */
      records: Row[]
      /** No row was left unchecked. */
      indeterminateCount: 0
    })
  | (ListViewFilterResultBase & {
      /** Some rows couldn't be checked, because a field wasn't read. */
      status: "partial"
      /** The rows that surely match, in their order. */
      records: Row[]
      /** How many rows couldn't be checked. */
      indeterminateCount: number
    })
  | (ListViewFilterResultBase & {
      /** The rows or the schema aren't available, or the saved filters can't be applied. */
      status: "unavailable" | "invalid"
      /** No rows: filtering didn't happen. */
      records: null
      /** No row was checked. */
      indeterminateCount: 0
    })

/** A value being edited, where a null filter is one whose field isn't chosen yet. */
export type ListViewFiltersDraftValue = Omit<
  ListViewFiltersValue,
  "filters"
> & {
  /** The filters, numbered by position, with null for one not chosen yet. */
  filters: readonly (ListViewFilterCondition | null)[]
}

type LogicTree = { not: boolean; parens: boolean } & (
  | { kind: "filter"; number: number }
  | { kind: "and" | "or"; left: LogicTree; right: LogicTree }
)

type LogicToken = "AND" | "OR" | "NOT" | "(" | ")" | number

type AnyField = ListViewFilterField<never>

/** The most filters a list view takes, and the most characters its filter logic takes. */
export const listViewFilterLimits = { filters: 10, logicLength: 120 } as const

const logicMessages = {
  tooLong: `Use at most ${listViewFilterLimits.logicLength} characters of filter logic.`,
  spelling: "Check the spelling in your filter logic.",
  notReferenced:
    "Some filter conditions are defined but not referenced in your filter logic.",
  operand: "Your filter is missing an operand.",
  parenthesis: "Your filter is missing a parenthesis.",
  rightOperand: "Your filter is missing right operand to AND or OR.",
  mixed:
    "Your filter must use parentheses around successive AND and OR expressions.",
}

/** Each operator's words, as the operator picker and a filter's summary show them. */
export const filterOperatorLabels: Record<ListViewFilterOperator, string> = {
  equals: "equals",
  "not-equal": "not equal to",
  contains: "contains",
  "not-contains": "does not contain",
  "starts-with": "starts with",
  "less-than": "less than",
  "greater-than": "greater than",
  "less-or-equal": "less or equal",
  "greater-or-equal": "greater or equal",
}

const equalityOperators = ["equals", "not-equal"] as const
const rangeOperators = [
  ...equalityOperators,
  "less-than",
  "greater-than",
  "less-or-equal",
  "greater-or-equal",
] as const

const operatorsByType: Record<
  ListViewFilterType,
  readonly ListViewFilterOperator[]
> = {
  text: [...equalityOperators, "contains", "not-contains", "starts-with"],
  picklist: equalityOperators,
  number: rangeOperators,
  currency: rangeOperators,
  percent: rangeOperators,
  date: rangeOperators,
  boolean: equalityOperators,
}

/** The operators a field offers: its kind's, narrowed by the field's own list. */
export function allowedFilterOperators(field: AnyField) {
  const builtIn = operatorsByType[field.type]
  return field.operators
    ? builtIn.filter((operator) => field.operators!.includes(operator))
    : builtIn
}

function validDay(value: unknown): value is string {
  if (typeof value !== "string") return false
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const date = new Date(Date.UTC(+match[1]!, +match[2]! - 1, +match[3]!))
  return date.toISOString().slice(0, 10) === value
}

function isValueOf(type: ListViewFilterType, value: unknown) {
  if (type === "boolean") return typeof value === "boolean"
  if (type === "date") return validDay(value)
  if (type === "text" || type === "picklist") return typeof value === "string"
  return typeof value === "number" && Number.isFinite(value)
}

/** Why a condition can't be applied to its field, or undefined when it can. */
export function checkFilterCondition(
  condition: ListViewFilterCondition,
  field: AnyField | undefined
) {
  if (!field) return `${condition.field} isn't available to filter by.`
  if (field.type !== condition.type) {
    return `${field.label} can't be filtered as a ${condition.type} field.`
  }
  if (!allowedFilterOperators(field).includes(condition.operator)) {
    return `${field.label} can't be filtered with "${filterOperatorLabels[condition.operator] ?? condition.operator}".`
  }
  const { operator, value } = condition
  if (value === null) {
    if (operator !== "equals" && operator !== "not-equal") {
      return `Enter a value for ${field.label}.`
    }
    if (!field.nullable) return `${field.label} can't be blank.`
    return undefined
  }
  if (!isValueOf(field.type, value)) {
    return `Enter a valid ${field.label} value.`
  }
  if (
    value === "" &&
    (operator === "contains" ||
      operator === "not-contains" ||
      operator === "starts-with")
  ) {
    return `Enter text for ${field.label} to match.`
  }
  if (
    field.type === "picklist" &&
    !field.options.some((option) => option.value === value)
  ) {
    return `"${value}" isn't a ${field.label} value.`
  }
  return undefined
}

function and(a: boolean | undefined, b: boolean | undefined) {
  if (a === false || b === false) return false
  return a === undefined || b === undefined ? undefined : true
}

function or(a: boolean | undefined, b: boolean | undefined) {
  if (a === true || b === true) return true
  return a === undefined || b === undefined ? undefined : false
}

function evaluateLogic(
  node: LogicTree,
  truths: readonly (boolean | undefined)[]
): boolean | undefined {
  const truth =
    node.kind === "filter"
      ? truths[node.number - 1]
      : (node.kind === "and" ? and : or)(
          evaluateLogic(node.left, truths),
          evaluateLogic(node.right, truths)
        )
  return node.not && truth !== undefined ? !truth : truth
}

function test(
  condition: ListViewFilterCondition,
  field: AnyField,
  raw: unknown,
  locale: string
): boolean | undefined {
  if (raw === undefined) return undefined
  if (raw !== null && !isValueOf(field.type, raw)) return undefined
  const { operator, value } = condition
  if (value === null || raw === null) {
    const same = value === raw
    if (operator === "equals") return same
    if (operator === "not-equal") return !same
    return operator === "not-contains"
  }
  let a = raw as string | number | boolean
  let b = value
  if (field.type === "text" && !field.caseSensitive) {
    a = (a as string).toLocaleLowerCase(locale)
    b = (b as string).toLocaleLowerCase(locale)
  }
  switch (operator) {
    case "equals":
      return a === b
    case "not-equal":
      return a !== b
    case "contains":
      return (a as string).includes(b as string)
    case "not-contains":
      return !(a as string).includes(b as string)
    case "starts-with":
      return (a as string).startsWith(b as string)
    case "less-than":
      return a < b
    case "greater-than":
      return a > b
    case "less-or-equal":
      return a <= b
    case "greater-or-equal":
      return a >= b
  }
}

function tokenizeLogic(text: string): LogicToken[] | string {
  if (text.length > listViewFilterLimits.logicLength) {
    return logicMessages.tooLong
  }
  const tokens: LogicToken[] = []
  for (const [word] of text.toUpperCase().matchAll(/[()]|[^\s()]+/g)) {
    if (/^(AND|OR|NOT|\(|\))$/.test(word)) tokens.push(word as LogicToken)
    else if (/^\d{1,2}$/.test(word)) tokens.push(Number(word))
    else return logicMessages.spelling
  }
  return tokens
}

class LogicError extends Error {}

function fail(message: string): never {
  throw new LogicError(message)
}

function parseLogic(tokens: readonly LogicToken[]): LogicTree | null | string {
  if (tokens.length === 0) return null
  let index = 0
  const parseRightOperand = (parse: () => LogicTree) => {
    try {
      return parse()
    } catch (error) {
      if (error instanceof LogicError) fail(logicMessages.rightOperand)
      throw error
    }
  }
  const term = (): LogicTree => {
    const token = tokens[index]
    if (token === undefined) return fail(logicMessages.operand)
    index++
    if (typeof token === "number") {
      return { kind: "filter", number: token, not: false, parens: false }
    }
    if (token === "NOT") {
      const node = term()
      return { ...node, not: !node.not }
    }
    if (token !== "(") return fail(logicMessages.spelling)
    const node = any()
    if (tokens[index] !== ")") return fail(logicMessages.parenthesis)
    index++
    return { ...node, parens: true }
  }
  const all = (): LogicTree => {
    const left = term()
    if (tokens[index] !== "AND") return left
    index++
    const right = parseRightOperand(all)
    return { kind: "and", left, right, not: false, parens: false }
  }
  const any = (): LogicTree => {
    const left = all()
    if (tokens[index] !== "OR") return left
    index++
    const right = parseRightOperand(any)
    if ([left, right].some((side) => side.kind === "and" && !side.parens)) {
      return fail(logicMessages.mixed)
    }
    return { kind: "or", left, right, not: false, parens: false }
  }
  try {
    const node = any()
    return index < tokens.length ? logicMessages.spelling : node
  } catch (error) {
    if (error instanceof LogicError) return error.message
    throw error
  }
}

function readLogic(
  text: string,
  count: number
): { node: LogicTree | null } | { error: string } {
  const tokens = tokenizeLogic(text)
  if (typeof tokens === "string") return { error: tokens }
  if (tokens.length === 0) return { node: null }
  const numbers = tokens.filter((token) => typeof token === "number")
  const outside = numbers.find((number) => number < 1 || number > count)
  if (outside !== undefined) {
    return {
      error: `The filter logic references an undefined filter: ${outside}.`,
    }
  }
  for (let number = 1; number <= count; number++) {
    if (!numbers.includes(number)) {
      return { error: logicMessages.notReferenced }
    }
  }
  const node = parseLogic(tokens)
  return typeof node === "string" ? { error: node } : { node }
}

/** The first problem with filter logic over this many filters, or undefined when it's valid. */
export function checkFilterLogic(text: string, count: number) {
  const read = readLogic(text, count)
  return "error" in read ? read.error : undefined
}

function keepsGroupParens(survivor: LogicTree, group: LogicTree) {
  return survivor.parens || (survivor.kind !== "filter" && group.parens)
}

function dropFilter(node: LogicTree, number: number): LogicTree | null {
  if (node.kind === "filter") {
    if (node.number === number) return null
    return node.number > number ? { ...node, number: node.number - 1 } : node
  }
  const left = dropFilter(node.left, number)
  const right = dropFilter(node.right, number)
  if (left && right) return { ...node, left, right }
  const survivor = left ?? right
  if (!survivor) return null
  return {
    ...survivor,
    not: survivor.not !== node.not,
    parens: keepsGroupParens(survivor, node),
  }
}

function printLogic(node: LogicTree): string {
  const body =
    node.kind === "filter"
      ? String(node.number)
      : `${printLogic(node.left)} ${node.kind.toUpperCase()} ${printLogic(node.right)}`
  const grouped = node.parens ? `(${body})` : body
  if (!node.not) return grouped
  return node.parens ? `NOT${grouped}` : `NOT ${grouped}`
}

/** Rewrites filter logic once filter `number` is gone, renumbering the rest. Unparseable logic stays as it is. */
export function removeFilterFromLogic(logic: string | null, number: number) {
  if (logic === null) return null
  const tokens = tokenizeLogic(logic)
  const node = typeof tokens === "string" ? tokens : parseLogic(tokens)
  if (node === null || typeof node === "string") return logic
  const rest = dropFilter(node, number)
  return !rest || (rest.kind === "filter" && !rest.not) ? "" : printLogic(rest)
}

/** Filter logic as Save stores it: trimmed, one line, no leading zeros, and null when empty. */
export function normalizeFilterLogic(logic: string | null) {
  const text = logic
    ?.trim()
    .replace(/\r\n|[\r\n]/g, " ")
    .replace(/\b0(\d)\b/g, "$1")
  return text ? text : null
}

function check(
  value: ListViewFiltersDraftValue,
  schema: ListViewFilterSchema<never>
) {
  const issues: ListViewFilterIssue[] = []
  const fields = new Map<string, AnyField>()
  for (const field of schema.fields) {
    if (fields.has(field.id)) {
      issues.push({
        scope: "schema",
        fieldId: field.id,
        message: `Two fields share the id ${field.id}.`,
      })
    }
    fields.set(field.id, field)
  }

  if (value.owner === "mine") {
    const message = !schema.owner
      ? "These records have no owner to filter by."
      : schema.owner.currentUserId == null
        ? `${schema.owner.mineLabel} can't be shown without the signed-in user.`
        : undefined
    if (message) issues.push({ scope: "owner", message })
  }

  if (value.filters.length > listViewFilterLimits.filters) {
    issues.push({
      scope: "filter",
      message: `Use at most ${listViewFilterLimits.filters} filters.`,
    })
  }
  value.filters.forEach((condition, index) => {
    const message = condition
      ? checkFilterCondition(condition, fields.get(condition.field))
      : undefined
    if (message) {
      issues.push({
        scope: "filter",
        filterNumber: index + 1,
        fieldId: condition?.field,
        message,
      })
    }
  })

  for (const locked of schema.lockedFilters ?? []) {
    const message = checkFilterCondition(
      locked.condition,
      fields.get(locked.condition.field)
    )
    if (message) {
      issues.push({
        scope: "locked",
        lockedKey: locked.key,
        fieldId: locked.condition.field,
        message,
      })
    }
  }

  let node: LogicTree | null = null
  if (value.logic !== null) {
    const parsed = readLogic(value.logic, value.filters.length)
    if ("error" in parsed) {
      issues.push({ scope: "logic", message: parsed.error })
    } else node = parsed.node
  }

  return { issues, node }
}

/** Every reason a value can't be applied with this schema, in order. A null filter isn't checked. */
export function validateListViewFilters<Row>(
  value: ListViewFiltersDraftValue,
  schema: ListViewFilterSchema<Row>
) {
  return check(value, schema as ListViewFilterSchema<never>).issues
}

function formatValue(
  condition: ListViewFilterCondition,
  field: AnyField | undefined,
  locale: string
) {
  const { value } = condition
  if (value === null) return '""'
  switch (condition.type) {
    case "text":
      return `"${value}"`
    case "picklist":
      return field?.type === "picklist"
        ? (field.options.find((option) => option.value === value)?.label ??
            String(value))
        : String(value)
    case "boolean":
      return value ? "True" : "False"
    case "date":
      return validDay(value)
        ? new Intl.DateTimeFormat(locale, {
            dateStyle: "medium",
            timeZone: "UTC",
          }).format(new Date(`${value}T00:00:00Z`))
        : String(value)
    case "currency":
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: (field?.type === "currency" && field.currencyCode) || "USD",
        minimumFractionDigits: 0,
      }).format(value as number)
    case "percent":
      return new Intl.NumberFormat(locale, {
        style: "percent",
        maximumFractionDigits: 2,
      }).format(value as number)
    case "number":
      return new Intl.NumberFormat(locale).format(value as number)
  }
}

/** A condition's operator and value in words, as `equals "Acme"` or `less than $50,000`. */
export function describeFilterCondition(
  condition: ListViewFilterCondition,
  field: AnyField | undefined,
  locale = "en-US"
) {
  return `${filterOperatorLabels[condition.operator] ?? condition.operator} ${formatValue(condition, field, locale)}`
}

function describeFilteredBy(
  value: ListViewFiltersValue,
  schema: ListViewFilterSchema<never>
) {
  const labels = [
    ...(schema.lockedFilters ?? []).map((locked) => locked.condition),
    ...value.filters,
  ].map(
    (condition) =>
      schema.fields.find((field) => field.id === condition.field)?.label ??
      condition.field
  )
  return labels.length > 0 ? labels.join(", ") : undefined
}

/** Keeps the rows saved filters match, and counts the rows it couldn't check. */
export function applyListViewFilters<Row>(
  records: Row[] | null,
  value: ListViewFiltersValue,
  schema: ListViewFilterSchema<Row> | null,
  { locale = "en-US" }: { locale?: string } = {}
): { props: ListViewFilterResult<Row>; issues: ListViewFilterIssue[] } {
  const filteredBy = schema
    ? describeFilteredBy(value, schema as ListViewFilterSchema<never>)
    : undefined
  if (records === null || schema === null) {
    return {
      props: {
        status: "unavailable",
        records: null,
        indeterminateCount: 0,
        filteredBy,
      },
      issues: [],
    }
  }
  const checked = check(value, schema as ListViewFilterSchema<never>)
  if (checked.issues.length > 0) {
    return {
      props: {
        status: "invalid",
        records: null,
        indeterminateCount: 0,
        filteredBy,
      },
      issues: checked.issues,
    }
  }
  const locked = schema.lockedFilters ?? []
  if (value.owner === "all" && value.filters.length === 0 && !locked.length) {
    return {
      props: { status: "ready", records, indeterminateCount: 0, filteredBy },
      issues: [],
    }
  }

  const fields = new Map(schema.fields.map((field) => [field.id, field]))
  const checkRow = (row: Row, condition: ListViewFilterCondition) => {
    const field = fields.get(condition.field)!
    return test(condition, field as AnyField, field.read(row), locale)
  }
  const kept: Row[] = []
  let indeterminateCount = 0
  const unread = new Map<string, number>()
  for (const row of records) {
    const unknownFields = new Set<string>()
    const note = (fieldId: string, truth: boolean | undefined) => {
      if (truth === undefined) unknownFields.add(fieldId)
      return truth
    }
    let truth: boolean | undefined = true
    if (value.owner === "mine") {
      const ownerId = schema.owner!.read(row)
      truth = note(
        "owner",
        ownerId === undefined
          ? undefined
          : ownerId === schema.owner!.currentUserId
      )
    }
    for (const filter of locked) {
      truth = and(
        truth,
        note(filter.condition.field, checkRow(row, filter.condition))
      )
    }
    const truths = value.filters.map((condition) =>
      note(condition.field, checkRow(row, condition))
    )
    const expression = checked.node
      ? evaluateLogic(checked.node, truths)
      : truths.reduce<boolean | undefined>(and, true)
    truth = and(truth, expression)
    if (truth === true) kept.push(row)
    if (truth === undefined) {
      indeterminateCount++
      for (const fieldId of unknownFields) {
        unread.set(fieldId, (unread.get(fieldId) ?? 0) + 1)
      }
    }
  }
  const issues = [...unread].map(([fieldId, count]): ListViewFilterIssue => ({
    scope: "data",
    fieldId,
    message: `${fieldId === "owner" ? "Owner" : fields.get(fieldId)!.label} couldn't be read for ${count} ${count === 1 ? "record" : "records"}.`,
  }))
  if (indeterminateCount > 0) {
    return {
      props: {
        status: "partial",
        records: kept,
        indeterminateCount,
        filteredBy,
      },
      issues,
    }
  }
  return {
    props: {
      status: "ready",
      records: kept,
      indeterminateCount: 0,
      filteredBy,
    },
    issues,
  }
}
