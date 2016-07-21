/*
 * Copyright © 2012-2016 VMware, Inc.  All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS, without
 * warranties or conditions of any kind, EITHER EXPRESS OR IMPLIED.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

'use strict';

var module = angular.module('lightwave.ui.sso');
module.controller('UsersAndGroupsCntrl', ['$scope', '$rootScope', 'popupUtil', 'IdentitySourceService', 'MemberService',
    'Util', 'GroupService', 'UserService', 'SolutionUserService',
    function ($scope, $rootScope, popupUtil, IdentitySourceService, MemberService,
              Util, GroupService, UserService, SolutionUserService) {

        $scope.vm = this;
        $scope.refresh = refresh;
        $scope.currentTab = 0;
        $scope.membersearchtypes = [{name: 'user'}, {name: 'group'}, {name: 'all'}];

        /* Users */
        $scope.vm.search = "";
        $scope.addNewUser = true;
        $scope.currentPassword = null;
        $scope.currentuser = {};
        $scope.newuser = {};
        $scope.addUser = addUser;
        $scope.showSetPassword = showSetPassword;
        $scope.editUser = editUser;
        $scope.getusers = getusers;
        $scope.viewUser = viewUser;
        $scope.getuser = getuser;
        $scope.deleteUser = deleteUser;
        $scope.isuserguest = isuserguest;
        $scope.isuserregularuser = isuserregularuser;
        $scope.isuseradmin = isuseradmin;
        $scope.canceladdnewuser = canceladdnewuser;

        /* Solution User */
        $scope.allgroups = [];
        $scope.vm.solutionusersearch = "";
        $scope.addNewSolutionUser = true;
        $scope.currentsolutionuser = {};
        $scope.newsolutionuser = {};
        $scope.editSolutionUser = editSolutionUser;
        $scope.addSolutionUser = addSolutionUser;
        $scope.getsolutionusers = getsolutionusers;
        $scope.viewSolutionUser = viewSolutionUser;
        $scope.getsolutionuser = getsolutionuser;
        $scope.deleteSolutionUser = deleteSolutionUser;
        $scope.previewcertificate = previewcertificate;

        /* Groups */
        $scope.vm.groupsearch = "";
        $scope.addNewGroup = true;
        $scope.currentgroup = {};
        $scope.newgroup = {};
        $scope.editGroup = editGroup;
        $scope.editGroupMembership = editGroupMembership;
        $scope.viewGroupMembership = viewGroupMembership;
        $scope.getgroups = getgroups;
        $scope.addGroup = addGroup;
        $scope.viewGroup = viewGroup;
        $scope.getgroup = getgroup;
        $scope.deleteGroup = deleteGroup;

        /* Util functions */
        $scope.timeConverter = Util.unixToDateText;
        $scope.displaytime = Util.numberToTime;


        init();

        function init() {
            $scope.error = '';
            $scope.vm.usersdataLoading = true;

            IdentitySourceService
                .GetAll($rootScope.globals.currentUser)
                .then(function (res) {
                    console.log('IdentitySourceService response: ' + JSON.stringify(res));
                    if (res.status == 200) {
                        setids(res.data);
                    }
                    else {
                        $rootScope.globals.errors = res.data;
                    }
                });
        }

        function setids(ids) {
            $scope.vm.identitysources = ids;
            if (ids != null && ids.length > 0) {

                for (var i = 0; i < ids.length; i++) {

                    if (ids[i].domainType == 'SYSTEM_DOMAIN') {
                        $scope.vm.identitysource = ids[i];
                        break;
                    }
                }
                getusers($scope.vm.identitysource, "");
            }
        }

        function viewUser(user) {
            if (user) {
                $scope.vm.selectedUser = user;
                var template = 'sso/usersandgroups/user/user.view.html';
                var controller = 'UserCntrl';
                popupUtil.open($scope, template, controller);
            }
        }

        function viewSolutionUser(solutionuser) {
            if (solutionuser) {
                $scope.vm.selectedSolutionUser = solutionuser;
                var template = 'sso/usersandgroups/solutionuser/solutionuser.view.html';
                var controller = 'SolutionUserCntrl';
                popupUtil.open($scope, template, controller);
            }
        }


        function addSolutionUser() {
            var template = 'sso/usersandgroups/solutionuser/solutionuser.add.html';
            var controller = 'SolutionUserCntrl';
            popupUtil.open($scope, template, controller);
        }

        function viewGroup(group) {
            if (group) {
                $scope.vm.selectedGroup = group;
                var template = 'sso/usersandgroups/group/group.view.html';
                var controller = 'GroupCntrl';
                popupUtil.open($scope, template, controller);
            }
        }


        function getusers(provider, name) {
            $scope.error = '';
            $scope.vm.usersdataLoading = true;
            $scope.currentTab = 0;
            if (provider != undefined) {
                $scope.currentuser = {};
                MemberService
                    .Search($rootScope.globals.currentUser, provider.name, "USER", "NAME", name)
                    .then(function (res) {
                        console.log('Users response: ' + res);
                        if (res.status == 200) {
                            $scope.vm.users = res.data.users;
                            $scope.vm.usersdataLoading = false;
                        }
                        else {
                            $rootScope.globals.errors = res.data;
                        }
                    });
            }
        }

        function getuser(current) {
            $scope.error = '';
            $scope.currentuser = {};
            var upn = current.name + "@" + current.domain;
            UserService
                .Get($rootScope.globals.currentUser, upn)
                .then(function (res) {
                    if (res.status == 200) {
                        $scope.currentuser = res.data;
                        getusergroups($scope.currentuser, $scope.vm.identitysource);
                    }
                    else {
                        $rootScope.globals.errors = res.data;
                    }
                });
        }

        function showSetPassword(user) {
            var template = 'sso/usersandgroups/user/user.password.html';
            var controller = 'UserCntrl';
            popupUtil.open($scope, template, controller);
        }

        function addUser() {
            var template = 'sso/usersandgroups/user/user.add.html';
            var controller = 'UserCntrl';
            popupUtil.open($scope, template, controller);
        }

        function editUser(user) {
            if (user) {
                $scope.vm.selectedUser = user;
                var template = 'sso/usersandgroups/user/user.edit.html';
                var controller = 'UserCntrl';
                popupUtil.open($scope, template, controller);
            }
        }

        function editSolutionUser(user) {
            if (user) {
                $scope.vm.selectedSolutionUser = user;
                var template = 'sso/usersandgroups/solutionuser/solutionuser.edit.html';
                var controller = 'SolutionUserCntrl';
                popupUtil.open($scope, template, controller);
            }
        }

        function editGroup(group) {
            if (group) {
                $scope.vm.selectedGroup = group;
                var template = 'sso/usersandgroups/group/group.edit.html';
                var controller = 'GroupCntrl';
                popupUtil.open($scope, template, controller);
            }
        }

        function editGroupMembership(group) {
            if (group) {
                $scope.vm.selectedGroup = group;
                var template = 'sso/usersandgroups/group/group.members.edit.html';
                var controller = 'GroupMembersCntrl';
                popupUtil.open($scope, template, controller);
            }
        }

        function viewGroupMembership(group) {
            if (group) {
                $scope.vm.selectedGroup = group;
                var template = 'sso/usersandgroups/groupmembers/group.members.view.html';
                var controller = 'GroupMembersCntrl';
                popupUtil.open($scope, template, controller);
            }
        }

        function canceladdnewuser() {
            $scope.newuser = {};
            $scope.addNewUser = true;
            $scope.currentPassword = null;
        }

        function deleteUser(user) {
            $scope.error = '';
            UserService
                .Delete($rootScope.globals.currentUser, user.details.upn)
                .then(function (res) {
                    if (res.status == 200  || res.status == 204) {
                        var provider = $scope.vm.identitysource;
                        getusers(provider, $scope.vm.search);
                    }
                    else {
                        $rootScope.globals.errors = res.data;
                    }
                });
        }


        function getgroups(providers, name) {
            $scope.error = '';
            $scope.vm.groupsdataLoading = true;
            $scope.newgroup = {};
            $scope.addNewGroup = true;
            $scope.currentTab = 2;
            if (providers != null) {
                var provider_name = '';
                for (var i = 0; i < providers.length; i++) {
                    if (providers[i].domainType == 'SYSTEM_DOMAIN') {
                        provider_name = providers[i].name;
                    }
                }

                $scope.currentgroup = {};
                // console.log('inside getgroups');
                MemberService
                    .Search($rootScope.globals.currentUser, provider_name, "GROUP", "NAME", name)
                    .then(function (res) {
                        if (res.status == 200) {
                            $scope.vm.groups = res.data.groups;
                            $scope.vm.groupsdataLoading = false;
                        }
                        else {
                            $rootScope.globals.errors = res.data;
                        }
                    });
            }
        }

        function getgroup(group, providers) {
            $scope.error = '';
            if (providers != null) {
                var provider_name = '';
                for (var i = 0; i < providers.length; i++) {
                    if (providers[i].domainType == 'SYSTEM_DOMAIN') {
                        provider_name = providers[i].name;
                    }
                }

                $scope.currentgroup = {};
                var upn = group.name + "@" + group.domain;
                GroupService
                    .Get($rootScope.globals.currentUser, upn)
                    .then(function (res) {
                        if (res.status == 200) {
                            $scope.currentgroup = res.data;
                            $scope.currentgroup.members = {};
                        }
                        else {
                            $rootScope.globals.errors = res.data;
                        }
                    })
                    .then(function (res) {
                        if (res.status == 200) {
                            if ($scope.currentgroup) {
                                GroupService
                                    .GetMembership($rootScope.globals.currentUser, upn, "USER")
                                    .then(function (res) {
                                        if (res.status == 200) {
                                            $scope.currentgroup.members.users = res.data.users;
                                        }
                                        else {
                                            $rootScope.globals.errors = res.data;
                                        }
                                    });
                            }
                        }
                        else {
                            $rootScope.globals.errors = res.data;
                        }
                    })
                    .then(function (res) {
                        if (res.status == 200) {
                            if ($scope.currentgroup) {
                                GroupService
                                    .GetMembership($rootScope.globals.currentUser, upn, "SOLUTIONUSER")
                                    .then(function (res) {
                                        if (res.status == 200) {
                                            $scope.currentgroup.members.solutionusers = res.data.solutionUsers;
                                        }
                                        else {
                                            $rootScope.globals.errors = res.data;
                                        }
                                    });
                            }
                            else {
                                $rootScope.globals.errors = res.data;
                            }
                        }
                    })
                    .then(function (res) {
                        if (res.status == 200) {
                            if ($scope.currentgroup) {
                                GroupService
                                    .GetMembership($rootScope.globals.currentUser, upn, "GROUP")
                                    .then(function (res) {
                                        if (res.status == 200) {
                                            $scope.currentgroup.members.groups = res.data.groups;
                                        }
                                        else {
                                            $rootScope.globals.errors = res.data;
                                        }
                                    });
                            }
                        }
                        else {
                            $rootScope.globals.errors = res.data;
                        }

                    });
            }
        }

        function addGroup() {
            var template = 'sso/usersandgroups/group/group.add.html';
            var controller = 'GroupCntrl';
            popupUtil.open($scope, template, controller);
        }

        function deleteGroup(group) {
            $scope.error = '';
            var upn = group.name + "@" + group.domain;
            GroupService
                .Delete($rootScope.globals.currentUser, upn)
                .then(function (res) {
                    if (res.status == 200 || res.status == 204) {
                        getgroups($scope.vm.identitysources, $scope.vm.groupsearch);
                    }
                    else {
                        $rootScope.globals.errors = res.data;
                    }
                });
        }

        function getsolutionusers(providers, name) {
            $scope.error = '';
            $scope.vm.solutionusersdataLoading = true;
            $scope.currentTab = 1;

            if (providers != null) {
                var provider_name = '';
                for (var i = 0; i < providers.length; i++) {
                    if (providers[i].domainType == 'SYSTEM_DOMAIN') {
                        provider_name = providers[i].name;
                    }
                }
                $scope.currentsolutionuser = {};
                MemberService
                    .Search($rootScope.globals.currentUser, provider_name, "SOLUTIONUSER", "NAME", name)
                    .then(function (res) {
                        if (res.status == 200) {
                            $scope.vm.solutionusers = res.data.solutionUsers;

                            if ($scope.vm.solutionusers) {
                                for (var i = 0; i < $scope.vm.solutionusers.length; i++) {
                                    $scope.vm.solutionusers[i].cert = Util.getCertificateDetails($scope.vm.solutionusers[i].certificate.encoded);
                                }
                            }
                            $scope.vm.solutionusersdataLoading = false;
                        }
                        else {
                            $rootScope.globals.errors = res.data;
                        }
                    });
            }
        }

        function getsolutionuser(solutionuser) {
            $scope.error = '';
            $scope.currentsolutionuser = {};
            SolutionUserService
                .Get($rootScope.globals.currentUser, solutionuser.name)
                .then(function (res) {
                    if (res.status == 200) {
                        $scope.currentsolutionuser = res.data;
                        $scope.currentsolutionuser.cert = Util.getCertificateDetails(res.data.certificate.encoded);
                    }
                    else {
                        $rootScope.globals.errors = res.data;
                    }
                });
        }

        function deleteSolutionUser(solutionuser) {
            $scope.error = '';
            SolutionUserService
                .Delete($rootScope.globals.currentUser, solutionuser.name)
                .then(function (res) {
                    if (res.status == 200  || res.status == 204) {
                        getsolutionusers($scope.vm.identitysources, $scope.vm.solutionusersearch);
                    }
                    else {
                        $rootScope.globals.errors = res.data;
                    }
                });
        }

        function refresh(provider) {
            $scope.error = '';
            if (provider != undefined) {
                if ($scope.currentTab == 0) {
                    getusers(provider, $scope.vm.search);

                } else if ($scope.currentTab == 1) {
                    getsolutionusers($scope.vm.identitysources, $scope.vm.solutionusersearch);

                } else if ($scope.currentTab == 2) {
                    getgroups($scope.vm.identitysources, $scope.vm.groupsearch);
                }
            }
        }

        function getusergroups(user, provider) {
            $scope.error = '';
            if (provider != undefined) {
                $scope.currentuser.groups = [];
                // console.log('inside getusergroups');
                var upn = user.name + '@' + user.domain;
                UserService
                    .GetGroups($rootScope.globals.currentUser, upn)
                    .then(function (res) {
                        if (res.status == 200) {
                            $scope.currentuser.groups = res.data;
                        }
                        else {
                            $rootScope.globals.errors = res.data;
                        }
                    });
            }
        }

        function isuserguest(user) {
            return !user || !user.role ||
                user.role != 'Administrators@' + user.domain ||
                user.role != 'Users@' + user.domain;
        }

        function isuserregularuser(user) {
            return user &&
                user.role &&
                user.role === 'Users@' + user.domain;
        }

        function isuseradmin(user) {
            return user &&
                user.role &&
                user.role === 'Administrators@' + user.domain;
        }

        function previewcertificate(solutionuser, contents) {
            if (!solutionuser.certificate) {
                solutionuser.certificate = {};
            }
            solutionuser.certificate.encoded = contents;
        };
    }]);