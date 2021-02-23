import Parse from "parse/node";
import "dotenv/config";

const PARSE_APP_ID = process.env.PARSE_APP_ID;
const PARSE_PARSE_SERVER_URL = process.env.PARSE_PARSE_SERVER_URL;
const PARSE_JAVASCRIPT_KEY = process.env.PARSE_JAVASCRIPT_KEY;
const PARSE_MASTER_KEY = process.env.PARSE_MASTER_KEY;
Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY, PARSE_MASTER_KEY);
Parse.serverURL = PARSE_PARSE_SERVER_URL;

export default Parse;
