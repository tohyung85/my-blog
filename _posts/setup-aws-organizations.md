---
title: "Set Up AWS Organizations"
excerpt: "AWS Organizations is a very useful service for managing multiple AWS accounts"
coverImage: "/images/setup-aws-organizations/aws-organizations.png"
date: "2020-03-16T05:35:07.322Z"
tags: ["aws"]
---

## Background & Use Case

As each AWS account is an isolated environment, having multiple accounts for different project resources or environments (Production, Test, Development) brings benefits by allowing issues such as security compromises, configuration issues to be contained within the affected account or environment. However, doing so typically translates into additional administrative overhead especially when the number of accounts grow.

AWS Organizations which faciliates management of multiple AWS accounts is a key service developed to address this issue. Key features include:

- Allowing billing from multiple accounts to be consolidated into a single management account
- Coupled with IAM, it can also allow access to member accounts with required permissions from the management account.
- Using Service Control Policies, it is even possible to limit the permissions of root users in member accounts.

## Overview of steps

1. [Create an AWS Management Account](#create-aws-acct)
2. [Create an AWS Organization](#create-aws-org)
3. Add a member account
   - [Create a new member account](#create-member-acct)
   - [Add an existing member account](#add-member-acct)
4. [Switching Roles between accounts](#switch-roles)

<a name="create-aws-acct"></a>

## Create an AWS Management Account

This step is simply a creation of an AWS account. As this should be relatively straightforward, we will not go into too much details here

<a name="create-aws-org"></a>

## Create an AWS Organization

1. Search and move to the AWS Organizations Service
   <img src="/images/setup-aws-organizations/search-aws-org.png"/>
   </br></br>
2. Click on create an AWS Organization
   <img src="/images/setup-aws-organizations/create-aws-org.png"/>
   </br></br>
3. You will receive an email from AWS so check your account email and click on the link to verify your email address
   <img src="/images/setup-aws-organizations/verify-email.png"/>
   </br></br>
4. Once done, if you navigate to the AWS Organizations, you will see that the AWS Organization has been created with the existing account as the management account.
   <img src="/images/setup-aws-organizations/create-aws-org-complete.png"/>
   </br></br>

<a name="create-member-acct"></a>

## Create a new member account

1. Click on Add Account
   <img src="/images/setup-aws-organizations/click-add-account.png"/>
   <br/><br/>
2. Select Create an AWS Account. You could also invite an existing AWS account if you have already have an existing member account, the instructions to do so are in the [next section](#add-member-acct).
   - Enter the account name.
   - You will also need to enter a unique email address for the account creation.
     <br/>
     A very handy trick to create a unique email address will be to include a "+" in our existing email address followed by a unique string as per the following screenshot. This allows you to create a unique email without having to create a brand new email account.
   - Finally enter the name of the IAM role which will be created in the member account. This will also the role which you will assume when logging into the member account from the management account. <br/>For consistency, let's use the default of OrganizationAccountAccessRole.
     - Point to note will be that if you had created this account manually
       <img src="/images/setup-aws-organizations/create-new-member-acct.png"/>
       <br/><br/>
3. It will take a couple of minutes but once the new member account has been created you should see it as one of the accounts in AWS Organizations
   <img src="/images/setup-aws-organizations/create-new-member-acct-complete.png"/>
   <br/><br/>

<a name="add-member-acct"></a>

## Add an existing member account

1. Click on Add Account
   <img src="/images/setup-aws-organizations/click-add-account.png"/>
   <br/><br/>
2. Select add an existing AWS account
3. Enter the account ID of the account you wish to add into the organization
   <img src="/images/setup-aws-organizations/invite-existing-acct.png"/>
   <br/><br/>
4. Check the inbox of the member account email and you will see that you have received an email invite to join the organization.
   <img src="/images/setup-aws-organizations/invite-email.png"/>
   <br/><br/>
5. Login to the member account and head to AWS Organizations and you will see that you have received an invite.
   <img src="/images/setup-aws-organizations/aws-org-invite.png"/>
   <br/><br/>
6. Go ahead and accept the invite
   <img src="/images/setup-aws-organizations/accept-invite.png"/>
   <br/><br/>
7. When adding an existing member account, you will also need to set up the required IAM role which can be assumed when logging in from the management account. This is will be handled as part of the process when you create a new member account directly from AWS Organizations but you will need to handle this manually if you are adding an existing account.</br>To do so, head to the IAM Service and click on create role.
   <img src="/images/setup-aws-organizations/create-role.png"/>
   <br/><br/>
8. You will first need to indicate trusted entities which are allowed to assume this role so select the type of trusted entity as another AWS Account and enter the account ID of the management account.
   <img src="/images/setup-aws-organizations/role-trust-relationship.png"/>
   <br/><br/>
9. We will now enter the permissions that this role will grant upon the user and in this case we select Administrator Access.
   <img src="/images/setup-aws-organizations/role-access.png"/>
   <br/><br/>
10. Finally we will review our inputs and enter the role name. For consistency with AWS defaulted values we will use OrganizationAccountAccessRole
    <img src="/images/setup-aws-organizations/role-name.png"/>
    <br/><br/>

<a name="switch-roles"></a>

## Switching Roles between accounts

1. Select Switch Roles from the topbar menu dropdown. If you do not see the option, please ensure that you have set up a user in IAM with Admnistrator Access and are signed in as that user. This is required as root users are not able to call STS:AssumeRole and so cannot be used to switch roles between accounts.
   <img src="/images/setup-aws-organizations/switch-roles-dropdown.png"/>
   <br/><br/>
2. Enter the account number of the member account you wish to log into.
3. Enter the name of the IAM role which you wish to assume in the member account. Note that the default name provided was OrganizationAccountAccessRole
4. The Display Name and color coding fields are optional but you would want to enter something descriptive.
5. Finally select switch roles and you will be logged into the member account
   <img src="/images/setup-aws-organizations/switch-roles.png"/>
   <br/><br/>
6. You will now see that you are logged into the member account and you will be able to return to the management account via the topbar menu dropdown
   <img src="/images/setup-aws-organizations/switch-roles-complete.png"/>
   <br/><br/>
7. Note that the role that you switched into is saved in your history and you will be able to switch into the member account at a single click in future.
   <img src="/images/setup-aws-organizations/switch-roles-future.png"/>
   <br/><br/>
