---
title: "Static Website Hosting on S3"
excerpt: "S3 is a cheap and scalable solution to host your static websites, checkout how you can do so in this post"
coverImage: "/images/s3-static-website-hosting/main.png"
date: "2020-03-16T05:35:07.322Z"
tags: ["aws", "s3", "hosting"]
---

## Background & Use Case

One of the really useful features of AWS S3 is it's ability to host static webpages. Using S3 the costs incurred for hosting a static webpage is simply the costs of storage in an S3 bucket and the data outgoing costs. For small start ups and personal webpages, the costs are almost neglible, the usage is also covered by the AWS free tier and hence would essentially be free for a year. This post aims to describe how it can be done.

## Overview of steps

1. [Create an S3 Bucket](#create-s3-bucket)
2. [Enable Static Website Hosting on the Bucket](#enable-static-website-hosting)
3. [Update the Bucket Policy](#update-bucket-policy)
4. [Upload the Website Files](#upload-files)
5. [Check out your site](#check-site)

   <a name="create-s3-bucket"></a>

## Create an S3 Bucket

1. First head to the S3 via the AWS Console search bar
   <img src="/images/s3-static-website-hosting/find-s3.png"/>
   </br></br>
2. In the S3 buckets page, click on Create Bucket
   <img src="/images/s3-static-website-hosting/s3-buckets.png"/>
   </br></br>
3. Enter the bucket name. If you intend to use a custom domain name, you should use the domain name which you have registered as the bucket name.
   <img src="/images/s3-static-website-hosting/create-bucket-1.png"/>
   </br></br>
4. Scroll down and in the Block Public Access settings for the Bucket section, uncheck the Block all public access item. There will be a warning and you will need to confirm the action. Go ahead and do so as you intend for the site to be accessible viat the internet.
   <img src="/images/s3-static-website-hosting/create-bucket-enable-public.png"/>
   </br></br>
5. You can leave the rest as per default and click on Create Bucket to start the process.
   <img src="/images/s3-static-website-hosting/create-bucket-trigger.png"/>
   </br></br>

<a name="enable-static-website-hosting"></a>

## Enable Static Website Hosting on the Bucket

1. The Bucket should be created relatively quickly and you will be able to see your bucket created in the S3 buckets page.
   <img src="/images/s3-static-website-hosting/bucket-created.png"/>
   </br></br>
2. Go ahead and click on the bucket name and click on Properties
   <img src="/images/s3-static-website-hosting/bucket-properties.png"/>
   </br></br>
3. Scroll to the Static website hosting section and click on Edit.
   <img src="/images/s3-static-website-hosting/edit-static-website-hosting.png"/>
   </br></br>
4. Now you will need to:
   - Click on the radio button to Enable Static website hosting
   - Select Host a static website under the Hosting type option
   - Enter the filename for the Index Document (Typically index.html).
   - Enter the filename for the Error Document
     <img src="/images/s3-static-website-hosting/static-website-config.png"/>
     </br></br>
5. Go ahead and save the changes.

<a name="update-bucket-policy"></a>

## Update the Bucket Policy

You will now need to update the bucket policy to allow read access to the bucket

1. Head back to the S3 buckets page, click on the bucket name and now select Permissions.
   <img src="/images/s3-static-website-hosting/bucket-permissions.png"/>
   </br></br>
2. Scroll down to the Bucket policy section, click on Edit and update it with the following:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicRead",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::replace-with-your-bucket-name/*"
       }
     ]
   }
   ```
   It should eventually look like this:
   <img src="/images/s3-static-website-hosting/bucket-policy.png"/>
   </br></br>
3. Once done, go ahead and click on Save Changes

<a name="upload-files"></a>

## Upload the Website Files

If you are using NextJs, you will need to update your project next.config.js to include the following before you build and upload your files. You will need to do this or you will find that your pages will serve a 404 error when you reload them as mentioned in [this issue](https://stackoverflow.com/questions/63591544/next-js-how-to-make-links-work-with-exported-sites-when-hosted-on-aws-cloudfron)

```js
module.exports = {
  trailingSlash: true,
};
```

This configuration basically causes NextJs to export pages as index.html files and require trailing slashes, /about becomes /about/index.html and is routable via /about/, the Nexjs links and routers will still function as normal.

You can now upload the web files which you wish to serve onto your bucket.

1. Head back to the S3 buckets page, click on the bucket name and under the Objects tab click Upload.
   <img src="/images/s3-static-website-hosting/upload-to-bucket.png"/>
   </br></br>
2. You will need to upload all files **within** your dist or out folder and not the folder itself. The final state of the bucket should look like this:
   <img src="/images/s3-static-website-hosting/s3-uploaded-files.png"/>
   </br></br>
   Important to note here is that you should have at minimum the files which you have entered as the Index Document (index.html) and Error Document in the steps above

<a name="check-site"></a>

## Check Out Your Site

The above steps should be sufficient to enable static hosting. Let's test it out.

1. First by heading to the Bucket and under the Properties tab, head to the static hosting section and you will see the url.
   <img src="/images/s3-static-website-hosting/s3-url.png"/>
   </br></br>
2. Copy that and paste it into your browser and you should see your website displayed

## Conclusion

This sums up how you can host your static website on the internet using AWS S3. There are additional steps you can do to make this better by first [configuring cloudfront](/posts/custom-domain-with-cloudfront) to serve your S3 site more quickly via caching and edge locations. We will also cover how to set up the a custom domain name in that post.
