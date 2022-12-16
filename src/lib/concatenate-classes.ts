export const concatenateClasses = (...classes: (string | false)[]) =>
  classes.filter((c): c is string => !!c).join(" ")