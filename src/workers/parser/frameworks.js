/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at <http://mozilla.org/MPL/2.0/>. */

import { getSymbols } from "./getSymbols";

export function getFramework(sourceId) {
  const sourceSymbols = getSymbols(sourceId);

  if (isReactComponent(sourceSymbols)) {
    return "React";
  }
  if (isAngularComponent(sourceSymbols)) {
    return "Angular";
  }
  if (isVueComponent(sourceSymbols)) {
    return "Vue";
  }
}

// React

function isReactComponent(sourceSymbols) {
  const { imports, classes, callExpressions } = sourceSymbols;
  return (
    (importsReact(imports) || requiresReact(callExpressions)) &&
    extendsReactComponent(classes)
  );
}

function importsReact(imports) {
  return imports.some(
    importObj =>
      importObj.source === "react" &&
      importObj.specifiers.some(specifier => specifier === "React")
  );
}

function requiresReact(callExpressions) {
  return callExpressions.some(
    callExpression =>
      callExpression.name === "require" &&
      callExpression.values.some(value => value === "react")
  );
}

function extendsReactComponent(classes) {
  let result = false;
  classes.some(classObj => {
    if (
      classObj.parent.name === "Component" ||
      classObj.parent.name === "PureComponent" ||
      classObj.parent.property.name === "Component"
    ) {
      result = true;
    }
  });

  return result;
}

// Angular

const isAngularComponent = sourceSymbols => {
  const { memberExpressions, identifiers } = sourceSymbols;
  return (
    identifiesAngular(identifiers) && hasAngularExpressions(memberExpressions)
  );
};

const identifiesAngular = identifiers => {
  return identifiers.some(item => item.name == "angular");
};

const hasAngularExpressions = memberExpressions => {
  return memberExpressions.some(
    item => item.name == "controller" || item.name == "module"
  );
};

// Vue

const isVueComponent = sourceSymbols => {
  const { identifiers } = sourceSymbols;
  return identifiers.some(identifier => identifier.name == "Vue");
};
