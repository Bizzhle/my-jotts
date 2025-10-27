import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import path from 'path';

export const loadTemplate = async (
  templateName: string,
  data: { emailAddress: string; url: string; token?: string },
) => {
  const baseDir =
    process.env.NODE_ENV === 'production'
      ? path.resolve(process.cwd(), 'dist', 'src', 'html-templates')
      : path.resolve(process.cwd(), 'src', 'html-templates');

  const templatePath = path.resolve(baseDir, `${templateName}.html`);

  if (!fs.existsSync(templatePath)) {
    throw new NotFoundException(`Template not found: ${templatePath}`);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');

  const compiledTemplate = handlebars.compile(template);

  return compiledTemplate(data);
};
