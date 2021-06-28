---
title: "How to transfer Route53 Domains between AWS Accounts"
excerpt: "Learn how you can make a transfer of route53 domains between multiple AWS Accounts"
coverImage: "/images/transfer-aws-domains-between-accounts/main.jpeg"
date: "2020-03-16T05:35:07.322Z"
tags: ["aws", "route53"]
---

## Background & Use Case

Before we begin, it is important to clarify that the details this article concern the migration of **Registed Domain Names** and not hosted zones which will be covered in my post [How to transfer Route53 Hosted Zones between AWS Accounts](/posts/transfer-hosted-zones).

There are 2 ways to execute the transfer:

1. [Support request to AWS Support](#aws-support)
2. [Via AWS Cli](#aws-cli)

The first option would be relatively hassle free but the downside to this would be that the process will be slower as you are dependent on when the AWS support staff who takes ~2 working days to respond to the request.

Before you begin either process, please make sure that:

- At least 14 days has elapsed since the domain name was registered or renewed. This is a pre-requisite so if that is the case you will need to wait till the necessary time has elapsed.
- You have the necessary IAM Permissions set up to perform the transfer. You must have permissions to the following actions: TransferDomains, DisableDomainTransferLock and RetrieveDomainAuthCode.

<a name="aws-support"></a>

## Transfer domain via AWS Support

1. Head to the support center using the AWS Console topbar
   <img src="/images/transfer-aws-domains-between-accounts/topbar-support-ticket.png"/>
   </br></br>
2. Create a case
   <img src="/images/transfer-aws-domains-between-accounts/support-menu.png"/>
   </br></br>
3. Populate the following details:
   - Select Account & billing support
   - Select Billing as the support type
   - Select Domain name registration issue as the Category
   - Enter "Transfer domain to another account" as the Subject
   - Enter the domain name and the source & destination account IDs in the description
   - Select your preferred contact options
   - Click on Create
     <img src="/images/transfer-aws-domains-between-accounts/support-form-1.png"/>
     </br></br>
     <img src="/images/transfer-aws-domains-between-accounts/support-form-2.png"/>
     </br></br>

<a name="cli-transfer"></a>

## Transfer domain via AWS Cli

In concept these are the following steps which need to be done:

- [The source account needs to request the domain transfer](#request-transfer)
- [The destination account needs to accept the domain transfer](#accept-transfer)
- [The destination account can perform some checks to verify that the transfer was successful](#check-transfer)

<a name="request-transfer"></a>

1. Check that your AWS Cli is using the source account profile
   You can verify this by entering the following in your command line and checking that the account number is correct:

```shell
aws sts get-caller-identity
```

You can also execute the following command and you should see the domain listed

```shell
aws route53domains list-domains
```

1. You should next get the receiving account ID by signing in via the AWS Console and checking the topbar
   <img src="/images/transfer-aws-domains-between-accounts/account-id.png"/>
   </br></br>
2. With that you can now effect the transfer by entering the following
   ```shell
   aws route53domains transfer-domain-to-another-aws-account --domain
     -name exampledomain.com --account-id 123456789 > acctTxferDetails.txt
   ```
   This would make a request to transfer the domain and save the command output to a file called acctTxferDetails.txt in the current working directory. It is recommended you do this so that you do not lose the password which is required for the receiving account to accept the domain transfer.
3. If you open the acctTxferDetails.txt you will should see the contents similar to the following:
   ```json
   {
     "OperationId": "some-operation-id",
     "Password": "some-password"
   }
   ```
4. You will now need to switch the profile of the AWS Cli to the receiving account or if the account belongs to someone else you will need to provide the administrator the password to execute the rest of the steps.

<br/>To switch to the other account you can enter the following

```shell
export AWS_DEFAULT_PROFILE=receiving-profile
```

<a name="accept-transfer"></a>

5. The next step will be for the receiving account to acknowledge and accept the domain transfer, this can be done using the following command:

```shell
aws route53domains accept-domain-transfer-from-another-aws-account --domain-name exampledomain.com --password "some-password" >> acctTxferDetails.txt
```

This command enables the receiving account to accept the transfer and also concatenates the output to the acctTxferDetails.txt file.
If you view the file contents, you should see the following:

```json
{
  "OperationId": "second-operation-id"
}
```

<a name="check-transfer"></a>

6. At this point the transfer should be completed but you can verify it by executing the following command:

```shell
aws route53domains get-operation-detail --operation-id second-operation-id
```

and you should receive an output as follows:

```json
{
  "OperationId": "second-operation-id",
  "Status": "SUCCESSFUL",
  "DomainName": "exampledomain.com",
  "Type": "INTERNAL_TRANSFER_IN_DOMAIN",
  "SubmittedDate": "2021-06-26T20:25:19.483000+08:00"
}
```

You can also list the domains in the receiving account and you should see the transfered domain listed.

```shell
   aws route53domains list-domains
```

With that the transfer should be completed. At this point you might want to also transfer the hosted zone between the accounts which is detailed in this [post](/posts/transfer-hosted-zones)
