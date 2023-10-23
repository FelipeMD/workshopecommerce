#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { EcommerceApiStack } from '../lib/ecommerce-api-stack';

const app = new cdk.App();

const env: cdk.Environment = {
    account: "655905992791",
    region: "us-east-1"
}

const tags = {
    cost: "WorkShopEcommerce",
    team: "Felipe Souza"
}

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
    tags: tags,
    env: env
})

const eCommerceApiStack = new EcommerceApiStack(app, "ECommerceApi", {
    catalogFetchHandler: productsAppStack.productsFetchHandler,
    tags: tags,
    env: env
})
eCommerceApiStack.addDependency(productsAppStack)