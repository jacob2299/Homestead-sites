# Homestead Sites

> With this command you can make new homestead sites fast and painless

## Prerequisites
* To use this command, you must have Node.js installed

## Install
`npm install -g homestead-sites`

## Usage

### Step 1

The first step to use this command is to set all the required options.

Available options:

**Path to homestead.yaml**

`site set yaml-file path-to-homestead-yaml`

**Path to the hosts file**

`site set hosts-file path-to-hosts-file`

**Path to the homestead folder**

`site set homestead-dir path-to-homestead-folder`

**Make sure to enter the full path**

Example: `C:/Users/YourName/Homestead/Homestead.yaml`

### Step 2

> This command requires administration rights

To add a new site, use the command below

`site new site-name -p code/path-to-your-project`
