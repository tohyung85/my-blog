---
title: "How to update Domain Name Servers on Route53"
excerpt: "Learn how to update the name servers of your domain name where Route53 is the domain registrar. This typically applies when you are transfering hosted zones"
coverImage: "/images/updating-route53-nameservers/main.jpeg"
date: "2020-03-16T05:35:07.322Z"
tags: ["aws", "route53"]
---

## Background & Use Case

After you have transfered hosted zones between Route53 and another provider or from another AWS account, you will need to update the name server records of the domain name. For clarity the steps below pertain only if you are using Route53 as your domain registrar is with the Route53.

## Overview of steps

1. Before beginning you will first determine if the domain name is currently under active service and if you can accomodate some downtime. If it is under active use and you wish to minimize downtime then you will need to carry out step 2 to update the TTL first otherwise you can skip to step 3.
2. [Update the TTL setting of the NS record in your hosted zone](#update-ttl)
3. [Update the name servers of the registered domain](#update-ns)

<a name="update-ttl"></a>

## Updating Hosted Zone TTL Settings

This section details how you can update the TTL settings of a NS Record for a hosted zone if you are using **Route53** for hosted zone management. If you are using another hosted zone, you will need to check if your respective hosted zone provider.

1. Head to Route53 hosted zones and select the hosted zone for the concerned domain:
   <img src="/images/updating-route53-nameservers/hostedzone.png"/>
   </br></br>
2. Click on the checkbox of the NS Record to select it and click Edit Record
   <img src="/images/updating-route53-nameservers/edit-ns-record.png"/>
   </br></br>
3. Update NS Record TTL settings in both the original and new hosted zone from the typical 172800 seconds (2days) to 60-900 secs
   <img src="/images/updating-route53-nameservers/update-TTL.png"/>
   </br></br>
4. Since the typical TTL settings are 2 days, it means that any request made a few minutes ago would be cached for up to 2 days before it gets refreshed with the new TTL settings. Therefore you should wait for 2 days from update of TTL to allow sufficient time for the DNS caches to be invalidated before proceeding with the changes below

<a name="update-ns"></a>

## Updating Name Servers of the registered domain

1. Obtain the new name servers. If the hosted zone is in AWS, you will be able to find them by heading to the Route53 hosted zone and selecting the concerned domain.
   <img src="/images/updating-route53-nameservers/hostedzone.png"/>
   </br></br>
2. Once there you will see the NS Record with the name server details.
3. Open a separate tab and head to Route53 registered domains and click on the concerned domain
   <img src="/images/updating-route53-nameservers/registered-domain-section.png"/>
   </br></br>
4. Click on the add or edit nameservers
   <img src="/images/updating-route53-nameservers/registered-domain-details.png"/>
   </br></br>
5. Update the nameservers to reflect the new NS which you have obtained in step 1.
   <img src="/images/updating-route53-nameservers/update-NS.png"/>
   </br></br>
6. If you previously reduced the NS Record TTL, now will be a good time to restore the TTL values back to the default 172800secs by following the instructions in [Updating Hosted Zone TTL Settings](#update-ttl)
