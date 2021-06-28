---
title: "How to transfer Route53 Hosted Zones between AWS Accounts"
excerpt: "There may be situations where you may with to transfer hosted zones between AWS accounts, this article attempts to show how it can be done"
coverImage: "/images/transfer-hosted-zones/transfer-hosted-zone-main.png"
date: "2020-03-16T05:35:07.322Z"
tags: ["aws", "route53"]
---

## Background & Use Case

Before we begin, it is important to clarify that the details this article concern the migration of **Hosted Zones** and not domain names which will be covered in my post [How to Transfer Route53 Domains between AWS Accounts](/posts/transfer-aws-domains-between-accounts). Furthermore domain name and hosted zones management are different functionalities of Route53 and it is actually fine to have them in different accounts. Having said so, there may be occassions where you wish to transfer hosted zones between detween AWS accounts. Such cases may include consolidating them into a single account or having the hosted zone in the same account as a transfered domain name to facilitate admnistration.

## Overview of steps

1. [Create a Public Hosted Zone in the Receiving Account](#create-hosted-zone)
2. [Migrating Hosted Zone Records](#migrate-records)
3. [Checks and Important Notes](#checks-and-notes)

<a name="create-hosted-zone"></a>

## Create a Public Hosted Zone in the Receiving Account

1. First, log into the receiving account head to the Route53 Dashboard:
   <img src="/images/transfer-hosted-zones/find-route53.png"/>
   </br></br>
2. Head to the Hosted zones section and click on "Create Hosted Zone".
   <img src="/images/transfer-hosted-zones/create-hosted-zone.png"/>
   </br></br>
3. Enter the domain name which you wish to create the hosted zone for, select "Public hosted zone" as the type and click on Create.
   <img src="/images/transfer-hosted-zones/create-hosted-zone-menu.png"/>
   </br></br>
4. The hosted zone will be created and you should be able to see it in the Hosted Zone section. At this point, you will want to take note of the hosted zone ID as well.
   <img src="/images/transfer-hosted-zones/hostedzoneid-new.png"/>
   </br></br>

<a name="migrate-records"></a>

## Migrating Hosted Zone records

Basically the goal of this step will be to create all the necessary records (e.g A, AAA, CNAME etc) in the new hosted zone. Therefore, you could also create the records manually one by one via the AWS console in the new hosted zone if there are just a few records and you are more comfortable with the AWS console.
</br> At this point it is also be a good time to point out that if the hosted zone in the source account only has the NS records and SOA records, you won't need to perform this step as creating a new hosted zone in the new account already creates a new set of these records.

</br> If you have additional records which you would like to migrate, you can continue with the following steps:

1. First log into the **source** account, head into the Route53 hosted zone section once again and take note of the hosted zone id
2. Head to the Route53 Dashboard:
   <img src="/images/transfer-hosted-zones/find-route53.png"/>
   </br></br>
3. Head to the Hosted zones section take note of the hosted zone ID in the \*_old_ account.
   <img src="/images/transfer-hosted-zones/hostedzoneid-old.png"/>
   </br></br>
4. In your command line, first ensure that you are using a profile of the source AWS account. You can check by entering the following and checking the account number

```shell
aws sts get-caller-identity
```

5. You can then use the following command to generate a list of record sets in the source hosted zone. This command also creates a file called migrateHostedZoneIn.json (You can name it however you want, just make sure you are able to keep track of the files) in the current working directory.

```shell
aws route53 list-resource-record-sets --hosted-zone-id Z123456789 > migrateHostedZoneIn.json
```

6. Now you will need to create a copy of the migrateHostedZoneIn.json file (let's call it migrateHostedZoneOut.json) in your text editor and perform the following steps:
   - First remove the records with "Type" NS and SOA as these are automatically created when you create a new hosted zone.
   - Next replace "ResourceRecordSets" with "Changes"
   - Add a "Comment" key value pair
   - For each record, wrap them in a ResourceRecordSet element, and add an Action element with value "CREATE".
   - Add opening and closing braces ( { } ) as required to make the JSON code valid.

As an example, assuming there is only a CNAME record, this is how the file contents of migrateHostedZoneIn.json will look before:

```json
{
  "ResourceRecordSets": [
    {
      "Name": "exampledomain.com.",
      "Type": "NS",
      "TTL": 172800,
      "ResourceRecords": [
        {
          "Value": "ns-1234.awsdns-52.co.uk."
        },
        {
          "Value": "ns-3211.awsdns-56.org."
        },
        {
          "Value": "ns-333.awsdns-24.com."
        },
        {
          "Value": "ns-111.awsdns-40.net."
        }
      ]
    },
    {
      "Name": "exampledomain.com.",
      "Type": "SOA",
      "TTL": 900,
      "ResourceRecords": [
        {
          "Value": "ns-1234.awsdns-52.co.uk. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400"
        }
      ]
    },
    {
      "Name": "www.exampledomain.com.",
      "Type": "CNAME",
      "TTL": 300,
      "ResourceRecords": [
        {
          "Value": "exampledomain.com"
        }
      ]
    }
  ]
}
```

This will be how the contents of migrateHostedZoneOut.json should look like after the changes have been applied:

```json
{
  "Comment": "Migrate hosted zone records",
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.exampledomain.com.",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "exampledomain.com"
          }
        ]
      }
    }
  ]
}
```

1. Now make sure you are using the receiving account profile in a similar way as step 4.
2. Run the following to update the record sets:

```shell
aws route53 change-resource-record-sets --hosted-zone-id Z987654321 --change-batch file://migrateHostedZoneOut.json
```

9. You should get a result as follows:

```json
{
  "ChangeInfo": {
    "Id": "/change/C08934792H6OIJ853Z0P",
    "Status": "PENDING",
    "SubmittedAt": "2021-06-26T15:07:10.397000+00:00",
    "Comment": "Migrate hosted zone records"
  }
}
```

<a name="checks-and-notes"></a>

## Checks and Important Notes

You will notice that the status above is indicated as PENDING. This is because it takes a while for the created records to be propagated through to the named servers. You can however do a check by performing the following:

1. Run the following to get the list of records in your new hosted zone, once again please make sure you are using the right profile

```shell
aws route53 list-resource-record-sets --hosted-zone-id Z987654321 > migrateHostedZoneResult.json
```

2. Compare the migrateHostedZoneIn.json file and the migrateHostedZoneResult.json file and if it is done right, the files should be the same.

3. In order to utilize the newly created hosted zone, you will also need to update the domain name DNS nameservers as well which will be covered in the post [How to Update Route53 Nameservers](/posts/updating-route53-nameservers).
4. Finally please note that typically by the DNS records can be cached by the DNS resolvers up to 2 days so you should wait for at least 2 days after updating the domain DNS nameservers before deleting the source hosted zone.

<br/> And that's the end of this tutorial and i certainly hope it helps provide some clarity!
