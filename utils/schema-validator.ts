import fs from 'fs/promises'
import path from 'path'
import { consoleLogger } from './consoleLoggerSingletonInstance'
import Ajv from 'ajv'
import { ApiError } from '../errors/ApiError'
import { test } from "@playwright/test"

// later move this into Framework constants file
const SCHEMA_BASE_PATH = './resources/response-schemas'
const ajv = new Ajv({ allErrors: true });
// {allErrors: true} flag is like soft asserton, e.g. if your schema have several errors, and after first 
// error also it will continue validation and accumulate all errors within the schema and print single output
// if u want to fail when first json schema failure comes then remove this flag

export async function validateSchema(dirName: string, fileName: string, responseBody: object) {

    await test.step(`SCHEMA VALIDATION: ${dirName}/${fileName}`, async () => {
        
        consoleLogger.info(`Validating schema for ${dirName}/${fileName}`)
        const schemaPath = path.join(SCHEMA_BASE_PATH, dirName, `${fileName}_schema.json`)
        const schema = await loadSchema(schemaPath)
        //consoleLogger.info("schema:", schema);
        const validate = ajv.compile(schema);

        const valid = validate(responseBody);
        if (!valid) {
            const errors = validate.errors;

            // 🔹 Convert AJV errors into readable string
            //const formatted = ajv.errorsText(errors, { separator: '\n' });

            // 🔹 Log clearly in console
            consoleLogger.error("❌ JSON Schema Validation Failed:\n" + JSON.stringify(errors));

            // 🔹 Optional: also throw custom error for Playwright
            throw new
                ApiError(`Response schema validation failed ${fileName}_schema.json: ${JSON.stringify(errors, null, 4)}\n\n+
        Actual Response body: \n` +
                    `${JSON.stringify(responseBody, null, 4)}`);
        }
    });

}

async function loadSchema(schemaPath: string) {

    try {
        consoleLogger.info(`Loading schema from ${schemaPath}`)
        // utf-8 will read file in string format and schemaContent will be json object in form of string
        const schemaContent = await fs.readFile(schemaPath, 'utf-8')

        // now we need to convert this json string format into actual json obj format
        return JSON.parse(schemaContent);
    } catch (error: any) {
        consoleLogger.error(`Failed to load schema from ${schemaPath}: ${error.message}`)
        throw new Error(`Failed to load schema from ${schemaPath}: ${error.message}`)
    }

}


// Testing above code
//const schemaStr = validateSchema('conduit/tags', 'GET_tags');