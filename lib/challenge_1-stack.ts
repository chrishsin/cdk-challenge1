import * as cdk from '@aws-cdk/core';
import * as patterns from 'cdk-fargate-patterns';
import * as certificatemanager from '@aws-cdk/aws-certificatemanager';
import * as ecs from '@aws-cdk/aws-ecs';

export class Challenge1Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nginxTask = new ecs.FargateTaskDefinition(this, 'Task', {
      cpu: 256,
      memoryLimitMiB: 512,
    })

    nginxTask.addContainer('nginx', {
      image: ecs.ContainerImage.fromRegistry('nginx:latest'),
      portMappings: [ { containerPort: 80 } ]
    })

    const cert = certificatemanager.Certificate.fromCertificateArn(this, 'MyCert', 'arn:aws:acm:us-west-2:709802478770:certificate/818cf2a5-fdb4-47cb-97cb-e381e077cc0c')

    new patterns.DualAlbFargateService(this, 'Challenge1', {
      tasks: [
        {
          task: nginxTask,
          external: { port: 443, certificate:[ cert ]},
          internal: { port: 80 },
        }
      ]
    })
    // The code that defines your stack goes here
  }
}
