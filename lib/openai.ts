import OpenAI from 'openai';
import { z } from 'zod';
import { makeParseableTextFormat } from 'openai/lib/parser';
import type { AutoParseableTextFormat } from 'openai/lib/parser';
import type { ResponseFormatTextJSONSchemaConfig } from 'openai/resources/responses/responses';

export const openai = new OpenAI();

export const zodTextFormat = <ZodInput extends z.ZodType>(
  zodObject: ZodInput,
  name: string,
  props?: Omit<ResponseFormatTextJSONSchemaConfig, 'schema' | 'type' | 'strict' | 'name'>
): AutoParseableTextFormat<z.infer<ZodInput>> => {
  return makeParseableTextFormat(
    {
      type: 'json_schema',
      ...props,
      name,
      strict: true,
      schema: z.toJSONSchema(zodObject, { target: 'draft-7' }),
    },
    (content) => zodObject.parse(JSON.parse(content))
  );
};
