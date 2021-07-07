---
title: "Improve web performance with Gzip and Brotli using AWS Cloudfront"
excerpt: "Compressing web files using Gzip and Brotli can bring significant improvements in web performance by reducing file size. Learn how you can configure Cloudfront to do this for you"
coverImage: "/images/cloudfront-compress-assets/main.png"
date: "2020-03-16T05:35:07.322Z"
tags: ["aws", "cloudfront", "gzip", "brotli", "compression"]
---

## Background & Use Case

Performance is a key factor in terms of user experience and also SEO optimization. For smaller web applications, this is usually not a major issue but as the application grows, file sizes tend to grow significantly.
Most developers utilize Gzip or Brotli to compress these files and hence speed up the delivery to the client's browsers. In some cases, it can bring about up to 90% improvement in performance!  
</br>

This post describes how you can use Cloudfront to auto compress your files served from S3.

## Overview of steps

The goal of this post is to show cloudfront can be configured to compress your files and you will need to set up S3 for static hosting and have an existing cloudfront configuration. If you have already done so, you can skip ahead to [step 3](#cloudfront-compress)
</br>

At a high level, these are the steps:

1. [Configure S3 for Static Hosting](/posts/s3-static-website-hosting)
2. [Configure Cloudfront to serve your assets](/posts/custom-domain-with-cloudfront)
3. [Update Cloudfront to for auto compression](#cloudfront-compress)
4. [Test it out](#test-compression)
5. [Potential Issues](#potential-issue)

<a name="cloudfront-compress"></a>

## Update Cloudfront to for auto compression

Before you proceed further, please note the following requirements for cloudfront to perform the compression:

1. The file must be of a type that CloudFront compresses. You can refer to the [AWS Docs](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html#compressed-content-cloudfront-file-types) to see the full details but in general, .js, .css, .html files are compressible
2. The file size must be between 1,000 and 10,000,000 bytes.
3. The response must include a Content-Length header so CloudFront can determine whether the size of the file is in the range that CloudFront compresses. If the Content-Length header is missing, CloudFront won’t compress the file.
4. The response must not include a Content-Encoding header.

If you meet the requirements, the next steps are as follows:

1. Head over to Cloudfront
   <img src="/images/cloudfront-compress-assets/find-cloudfront.png"/>
   </br></br>
2. Click on your distribution
   <img src="/images/cloudfront-compress-assets/dist-dashboard.png"/>
   </br></br>
3. CLick on the Behaviors tab and select Edit
   <img src="/images/cloudfront-compress-assets/dist-behavior.png"/>
   </br></br>
4. Click on the option to use a cache and origin request policy instead of Use legacy cache settings. Also select the option to compress files automatically
   <img src="/images/cloudfront-compress-assets/edit-behavior.png"/>
   </br></br>
5. Go ahead and confirm the edits.
   <img src="/images/cloudfront-compress-assets/edit-behavior-confirm.png"/>
   </br></br>
6. You will need to wait for the updates to be deployed so wait for the dashboard to indicate that the distribution has been deployed
   <img src="/images/cloudfront-compress-assets/dist-deployed.png"/>
   </br></br>

   <a name="test-compression"></a>

## Test it out

1. To properly test this out, first invalidate the cloudfront cache. This is required to prevent cloudfront will continue to serve files which have been cached before you made the above changes.
   <img src="/images/cloudfront-compress-assets/click-add-account.png"/>
   <br/><br/>
2. You can now open the developer tools in Chrome and enter your domain name in the url bar. Click on an asset and you should see a content-encoding key value in the header response.
   <img src="/images/cloudfront-compress-assets/response-header.png"/>
   <br/><br/>
3. Alternatively you can run the following in your terminal

```shell
curl -v -H "Accept-Encoding: gzip" https://www.YOURDOMAINNAME.com --output test.txt
```

This makes a call to your domain name with Accept-Encoding in the Request Header and also save the output into a test.txt file. Once the call is successful, you should also see a header response with a content-encoding

```shell
< Server: AmazonS3
< Content-Encoding: gzip
< Vary: Accept-Encoding
```

<a name="potential-issue"></a>

## Potential Issues

At this point, would like to also point out a potential issue you may face. There used to be an issue whereby the S3 origin does not send a content length header as indicated in this [stackoverflow post](https://stackoverflow.com/questions/35590622/cloudfront-with-s3-website-as-origin-is-not-serving-gzipped-files).
I personally did not encounter this issue but just in case you do, you can head over to the S3 bucket under permissions and update the CORS configuration as follows:
<img src="/images/cloudfront-compress-assets/s3-permissions.png"/>
<br/><br/>

```js
[
  {
    AllowedHeaders: ["Authorization", "Content-Length"],
    AllowedMethods: ["GET"],
    AllowedOrigins: ["*"],
    ExposeHeaders: [],
    MaxAgeSeconds: 3000,
  },
];
```

This ensures that the S3 origin sends the Content-Length Header to Cloudfront.

### Conclusion

As you can see, once you have your S3 bucket set up for static hosting and the cloudfront configurations set up, the updates to enable autocompression is relatively straightforward.
<br/>
