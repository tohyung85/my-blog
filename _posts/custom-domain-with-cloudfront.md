---
title: "How to configure Cloudfront for Static Website Hosting with Custom Domain Name"
excerpt: "Cloudfront is very good way to serve your S3 site more quickly via caching and edge locations"
coverImage: "/images/custom-domain-with-cloudfront/main.png"
date: "2020-03-16T05:35:07.322Z"
tags: ["aws", "cloudfront", "s3", "acm"]
---

## Background & Use Case

This post assumes that you have already got a domain name and hosting zone set up in Route53. You will also need to have an S3 bucket set up and configured for static hosting. You can refer to [this post](/posts/s3-static-website-hosting) for instructions on doing so.

## Overview of steps

1. [Create an SSL certificate in ACM](#create-acm-cert)
2. [Create a Cloudfront Distribution](#create-cf-dist)
3. [Configure Route53 Hosting Zone Records](#config-r53)

<a name="create-acm-cert"></a>

## Create an SSL certificate in ACM (Amazon Certificate Manager)

As we are planning to use our custom domain name to server our files, we will need to first create a custom SSL certificate before creating the Cloudfront distribution.

1. First head to Certificate Manager via the console search box.
   <img src="/images/custom-domain-with-cloudfront/find-acm.png"/>
   </br></br>
2. If this is the first certificate, you will see the following so click on Get Started, or else you can click on Request a certificate
   <img src="/images/custom-domain-with-cloudfront/acm-get-public-cert.png"/>
   </br></br>
3. Select the option to Create a public certificate and click Next
   <img src="/images/custom-domain-with-cloudfront/acm-create-cert.png"/>
   </br></br>
4. You will need to first enter the domain name which you will be issuing the SSL certificate for. So key in the domain name which you have registered. You will also want to enter the domain name with www.\* prefix as well.
   <img src="/images/custom-domain-with-cloudfront/acm-domain-name.png"/>
   </br></br>
5. You will now need to validate your ownership of the domain name which can be done either via 1) Configuration of the domain DNS or 2) Email. Since our domain is already set up in Route 53, let's select the DNS validation option. Click on Next.
   <img src="/images/custom-domain-with-cloudfront/acm-domain-validation.png"/>
   </br></br>
6. You can enter some tags if you wish. If not, click Review.
7. Review your entries and click on Confirm and Request
   <img src="/images/custom-domain-with-cloudfront/acm-review-confirm.png"/>
   </br></br>
8. If you head to the Certificates dashboard you will see the certificate being created with status Pending. Expand the certificate row and the domains. Click on Create record in Route 53 for **every** domain.
   <img src="/images/custom-domain-with-cloudfront/acm-select-create-r53-record.png"/>
   </br></br>
9. There will be a pop up and so click on Create to create the CNAME record in your Route53 hosted zone.
   <img src="/images/custom-domain-with-cloudfront/acm-create-r53-record.png"/>
   </br></br>
10. It takes a while for the validation to be done and once complete, you should see the certificate as issued
    <img src="/images/custom-domain-with-cloudfront/acm-certificate-issued.png"/>
    </br></br>

    <a name="create-cf-dist"></a>

## Create a Cloudfront Distribution

Now that you have a custom SSL certificate for your domain, you can start the process to create a cloudfront distribution.

1. Head over to Cloudfront via the AWS Console search bar
   <img src="/images/custom-domain-with-cloudfront/find-cloudfront.png"/>
   </br></br>
2. Click on Create Distribution
   <img src="/images/custom-domain-with-cloudfront/distributions-dashboard.png"/>
   </br></br>
3. Key in the Origin Domain Name, if you are using S3 for hosting you can get the domain name by heading to the S3 Bucket, Properties and under the Static website hosting section:
   <img src="/images/custom-domain-with-cloudfront/s3-url.png"/>
   </br></br>
4. Once you have entered it, you should have the following. Please note that this is the domain name so you will need to remove the http:// portion from the url. Please also note that the domain name is **different** from what AWS would suggest in the dropdown.
   <img src="/images/custom-domain-with-cloudfront/cloudfront-create-dist-1.png"/>
   </br></br>
5. Scroll down and in the next section select the option to Redirect HTTP to HTTPS
   <img src="/images/custom-domain-with-cloudfront/cloudfront-create-dist-2.png"/>
   </br></br>
6. In the next section enter your domain names into the Alternate Domain Names
7. You should also select Custom SSL Certificate and select the certificate which you have created in the prior section.
   <img src="/images/custom-domain-with-cloudfront/cloudfront-create-dist-3.png"/>
   </br></br>
8. You can keep the rest of the defaults, scroll down and click on Create Distribution.
9. Wait for the distribution creation to be completed. Once done you should see this.
   <img src="/images/custom-domain-with-cloudfront/cloudfront-created.png"/>
   </br></br>
10. Take note of the cloudfront domain name highlighted above

<a name="config-r53"></a>

## Configure Route53 Hosting Zone Records

The last step now will be to insert an Alias record to your domain's hosted zone to route traffic to the cloudfront distribution.

1. Head to the Route53 hosted zone and click on Create Record
   <img src="/images/custom-domain-with-cloudfront/cloudfront-created.png"/>
   </br></br>
2. First create an A record for the domain. click on the switch to use an Alias instead of an IP address. Select cloudfront as the service and select the cloudfront domain.
   <img src="/images/custom-domain-with-cloudfront/r53-create-A-record.png"/>
   </br></br>
3. Next create a CNAME record for the www.\* prefix domain. Enter the domain name as the value.
   <img src="/images/custom-domain-with-cloudfront/r53-create-CNAME.png"/>
   </br></br>

And there all done! If you enter your domain name in the web browser, you should be able to access your static website which is served via Cloudfront!
