import { clauseOperators } from '../fuselink/queryAPI';
import { queryOperators } from '../fuselink/queryAPI';

export function isCanvasComplete(canvas) {
  let clauses = canvas
    .filter((exp) => exp.get('type') === 'clause')
    .skipWhile((exp) => exp.get('facet') && exp.get('value'));
  let expressions = canvas
    .filter((exp) => exp.get('type') === 'expression')
    .skipWhile((exp) => exp.get('left') && exp.get('right'));

  return clauses.size === 0 && expressions.size === 0;
}

export function prepareCanvas(canvas) {
  let resolvedClauses = canvas.map((exp) => {
    if (exp.get('type') === 'clause') {
      return exp.set(
        'resolved',
        clauseOperators[exp.get('clauseOperator')](exp.get('facet'), exp.get('value'))
        );
    }
    return exp;
  });

  return resolvedClauses;
}

export function traverseCanvas(canvas) {
  let rootResolved = canvas.find((exp) => exp.get('id') === 0).get('resolved');
  if (rootResolved) {
    return canvas;
  }
  let resolvingCanvas = canvas.map((exp) => {
    let left = canvas.find((e) => e.get('id') === exp.get('left'));
    let right = canvas.find((e) => e.get('id') === exp.get('right'));

    if (exp.get('type') === 'expression') {
      if (!exp.get('resolved')) {
        if (left.get('resolved') && right.get('resolved')) {
          return exp.set('resolved',
            queryOperators[exp.get('operator')](left.get('resolved'), right.get('resolved'))
          );
        }
        return exp;
      }
      return exp;
    }
    return exp;
  });

  return traverseCanvas(resolvingCanvas);
}

export function expressionsAreComplete(canvas) {
  let expressions = canvas
    .filter((exp) => exp.get('type') === 'expression');

  let filteredExpressions = expressions
    .filter((exp) => exp.get('left'))
    .filter((exp) => exp.get('right'));

  return filteredExpressions.size === expressions.size;
}
