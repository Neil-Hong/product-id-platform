export type AmplifyDependentResourcesAttributes = {
  "api": {
    "authApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "productApi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "function": {
    "authFunction": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "productFunction": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "productDB": {
      "Arn": "string",
      "Name": "string",
      "PartitionKeyName": "string",
      "PartitionKeyType": "string",
      "Region": "string",
      "StreamArn": "string"
    }
  }
}