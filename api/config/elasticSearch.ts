import { Client } from "@elastic/elasticsearch";
import dotenv from 'dotenv';
dotenv.config();

const elasticHost = process.env.ELASTIC_HOST as string;
const elasticUser = process.env.ELASTIC_USER as string;
const elasticPass = process.env.ELASTIC_PASS as string;

export const elasticConnection = new Client({
    node: elasticHost,
    auth: {
        username: elasticUser,
        password: elasticPass
    },
});

