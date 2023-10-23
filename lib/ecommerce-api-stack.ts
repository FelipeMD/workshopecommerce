import * as cdk from "aws-cdk-lib";
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cwLogs from "aws-cdk-lib/aws-logs"
import * as apiGateway from "aws-cdk-lib/aws-apigateway"
import {Construct} from "constructs";

interface ApiStackProps extends cdk.StackProps{
    catalogFetchHandler: lambdaNodeJs.NodejsFunction
}
export class EcommerceApiStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props)

        const logGroup = new cwLogs.LogGroup(this, "WorkshopEcommerceApiLogs")
        const api = new apiGateway.RestApi(this, "WorkshopEcommerceApi", {
            restApiName: "WorkshopEcommerceApi",
            cloudWatchRole: true,
            deployOptions: {
                accessLogDestination: new apiGateway.LogGroupLogDestination(logGroup),
                accessLogFormat: apiGateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true
                })
            }
        })

        const catalogsFetchIntegration = new apiGateway.LambdaIntegration(props.catalogFetchHandler)

        const catalogsResource = api.root.addResource("products")
        catalogsResource.addMethod("GET", catalogsFetchIntegration)
    }
}