export type NumericRange = [number, number]

export function getNumericBounds(values: number[]) {
  if (values.length === 0) {
    return null
  }

  return [Math.min(...values), Math.max(...values)] as NumericRange
}

export function rangesEqual(
  left: NumericRange | null,
  right: NumericRange | null
) {
  if (!left && !right) {
    return true
  }

  if (!left || !right) {
    return false
  }

  return left[0] === right[0] && left[1] === right[1]
}

export function normalizeRange(
  range: NumericRange | null,
  bounds: NumericRange | null
) {
  if (!bounds) {
    return null
  }

  if (!range) {
    return bounds
  }

  const lowerBound = Math.max(bounds[0], Math.min(range[0], bounds[1]))
  const upperBound = Math.min(bounds[1], Math.max(range[1], bounds[0]))

  return [
    Math.min(lowerBound, upperBound),
    Math.max(lowerBound, upperBound),
  ] as NumericRange
}

export function normalizeStoredRange(
  range: NumericRange | null,
  bounds: NumericRange | null
) {
  if (!range) {
    return null
  }

  const normalizedRange = normalizeRange(range, bounds)

  if (!normalizedRange || (bounds && rangesEqual(normalizedRange, bounds))) {
    return null
  }

  return normalizedRange
}
