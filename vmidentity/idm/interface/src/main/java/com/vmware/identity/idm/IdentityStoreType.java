/*
 *
 *  Copyright (c) 2012-2015 VMware, Inc.  All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License.  You may obtain a copy
 *  of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, without
 *  warranties or conditions of any kind, EITHER EXPRESS OR IMPLIED.  See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 *
 */

package com.vmware.identity.idm;

/**
 * User: snambakam
 * Date: 12/26/11
 * Time: 10:58 PM
 */
public enum IdentityStoreType
{
    IDENTITY_STORE_TYPE_ACTIVE_DIRECTORY,
    IDENTITY_STORE_TYPE_LDAP,
    IDENTITY_STORE_TYPE_VMWARE_DIRECTORY,
    IDENTITY_STORE_TYPE_LOCAL_OS,
    IDENTITY_STORE_TYPE_LDAP_WITH_AD_MAPPING
}
