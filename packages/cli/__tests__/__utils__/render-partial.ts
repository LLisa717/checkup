import * as Handlebars from 'handlebars';
import * as path from 'path';

import { ReportComponentType, ReportResultData } from '@checkup/core';

import { readFileSync } from 'fs-extra';

export type CompiledPartials = {
  [key in ReportComponentType]: HandlebarsTemplateDelegate;
};

const COMPILED_PARTIALS: CompiledPartials = {
  [ReportComponentType.NumericalCard]: getPartialDelegate('numerical-card.hbs'),
  [ReportComponentType.Table]: getPartialDelegate('table.hbs'),
  [ReportComponentType.PieChart]: getPartialDelegate('pie-chart.hbs'),
};

function getPartialDelegate(partialPath: string): HandlebarsTemplateDelegate {
  let fullPartialPath = path.join(__dirname, `../../static/components/${partialPath}`);
  let partialRaw = readFileSync(fullPartialPath, 'utf8');
  return Handlebars.compile(partialRaw);
}

export function renderPartialAsHtml(componentData: ReportResultData): string {
  return COMPILED_PARTIALS[componentData.componentType]({ resultData: componentData });
}
