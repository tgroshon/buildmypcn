"use strict";var ApplicationConfiguration=function(){var applicationModuleName="buildmypcn",applicationModuleVendorDependencies=["ngResource","ngCookies","ngAnimate","ngTouch","ngSanitize","ui.router","ui.bootstrap","ui.utils"],registerModule=function(moduleName,dependencies){angular.module(moduleName,dependencies||[]),angular.module(applicationModuleName).requires.push(moduleName)};return{applicationModuleName:applicationModuleName,applicationModuleVendorDependencies:applicationModuleVendorDependencies,registerModule:registerModule}}();angular.module(ApplicationConfiguration.applicationModuleName,ApplicationConfiguration.applicationModuleVendorDependencies),angular.module(ApplicationConfiguration.applicationModuleName).config(["$locationProvider",function($locationProvider){$locationProvider.hashPrefix("!")}]),angular.element(document).ready(function(){"#_=_"===window.location.hash&&(window.location.hash="#!"),angular.bootstrap(document,[ApplicationConfiguration.applicationModuleName])}),ApplicationConfiguration.registerModule("core"),ApplicationConfiguration.registerModule("diagrams"),ApplicationConfiguration.registerModule("groups"),ApplicationConfiguration.registerModule("users"),angular.module("core").config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$urlRouterProvider.otherwise("/"),$stateProvider.state("home",{url:"/",templateUrl:"modules/core/views/home.client.view.html"})}]),angular.module("core").controller("HeaderController",["$scope","Authentication","Menus",function($scope,Authentication,Menus){$scope.authentication=Authentication,$scope.isCollapsed=!1,$scope.menu=Menus.getMenu("topbar"),$scope.toggleCollapsibleMenu=function(){$scope.isCollapsed=!$scope.isCollapsed},$scope.$on("$stateChangeSuccess",function(){$scope.isCollapsed=!1})}]),angular.module("core").controller("HomeController",["$scope","Authentication","Groups","Diagrams",function($scope,Authentication,Groups,Diagrams){$scope.authentication=Authentication,$scope.find=function(){$scope.groups=Groups.query(),$scope.diagrams=Diagrams.query()}}]),angular.module("core").service("Menus",[function(){this.defaultRoles=["*"],this.menus={};var shouldRender=function(user){if(!user)return this.isPublic;if(~this.roles.indexOf("*"))return!0;for(var userRoleIndex in user.roles)for(var roleIndex in this.roles)if(this.roles[roleIndex]===user.roles[userRoleIndex])return!0;return!1};this.validateMenuExistance=function(menuId){if(menuId&&menuId.length){if(this.menus[menuId])return!0;throw new Error("Menu does not exists")}throw new Error("MenuId was not provided")},this.getMenu=function(menuId){return this.validateMenuExistance(menuId),this.menus[menuId]},this.addMenu=function(menuId,isPublic,roles){return this.menus[menuId]={isPublic:isPublic||!1,roles:roles||this.defaultRoles,items:[],shouldRender:shouldRender},this.menus[menuId]},this.removeMenu=function(menuId){this.validateMenuExistance(menuId),delete this.menus[menuId]},this.addMenuItem=function(menuId,menuItemTitle,menuItemURL,menuItemType,menuItemUIRoute,isPublic,roles,position){return this.validateMenuExistance(menuId),this.menus[menuId].items.push({title:menuItemTitle,link:menuItemURL,menuItemType:menuItemType||"item",menuItemClass:menuItemType,uiRoute:menuItemUIRoute||"/"+menuItemURL,isPublic:null===isPublic||"undefined"==typeof isPublic?this.menus[menuId].isPublic:isPublic,roles:null===roles||"undefined"==typeof roles?this.menus[menuId].roles:roles,position:position||0,items:[],shouldRender:shouldRender}),this.menus[menuId]},this.addSubMenuItem=function(menuId,rootMenuItemURL,menuItemTitle,menuItemURL,menuItemUIRoute,isPublic,roles,position){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)this.menus[menuId].items[itemIndex].link===rootMenuItemURL&&this.menus[menuId].items[itemIndex].items.push({title:menuItemTitle,link:menuItemURL,uiRoute:menuItemUIRoute||"/"+menuItemURL,isPublic:null===isPublic||"undefined"==typeof isPublic?this.menus[menuId].items[itemIndex].isPublic:isPublic,roles:null===roles||"undefined"==typeof roles?this.menus[menuId].items[itemIndex].roles:roles,position:position||0,shouldRender:shouldRender});return this.menus[menuId]},this.removeMenuItem=function(menuId,menuItemURL){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)this.menus[menuId].items[itemIndex].link===menuItemURL&&this.menus[menuId].items.splice(itemIndex,1);return this.menus[menuId]},this.removeSubMenuItem=function(menuId,submenuItemURL){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)for(var subitemIndex in this.menus[menuId].items[itemIndex].items)this.menus[menuId].items[itemIndex].items[subitemIndex].link===submenuItemURL&&this.menus[menuId].items[itemIndex].items.splice(subitemIndex,1);return this.menus[menuId]},this.addMenu("topbar")}]),angular.module("diagrams").run(["Menus",function(Menus){Menus.addMenuItem("topbar","Diagrams","diagrams","dropdown","/diagrams(/create)?"),Menus.addSubMenuItem("topbar","diagrams","List Diagrams","diagrams"),Menus.addSubMenuItem("topbar","diagrams","New Diagram","diagrams/create")}]),angular.module("diagrams").config(["$stateProvider",function($stateProvider){$stateProvider.state("listDiagrams",{url:"/diagrams",templateUrl:"modules/diagrams/views/list-diagrams.client.view.html"}).state("createDiagram",{url:"/diagrams/create",templateUrl:"modules/diagrams/views/create-diagram.client.view.html"}).state("viewDiagram",{url:"/diagrams/:diagramId",templateUrl:"modules/diagrams/views/view-diagram.client.view.html"}).state("editDiagram",{url:"/diagrams/:diagramId/edit",templateUrl:"modules/diagrams/views/edit-diagram.client.view.html"})}]),angular.module("diagrams").controller("DiagramsController",["$scope","$stateParams","$location","Authentication","Diagrams","Groups","PCN",function($scope,$stateParams,$location,Authentication,Diagrams,Groups,PCN){function getStepPredecessorsFromDiagram(diagram){for(var stepPredecessors={},i=0;i<diagram.steps.length;i++){for(var step=diagram.steps[i],stepObject={},j=0;j<step.predecessors.length;j++){var predecessor=step.predecessors[j];stepObject[predecessor.id]=!0}stepPredecessors[step.id]=stepObject}return stepPredecessors}$scope.authentication=Authentication,Groups.query().$promise.then(function(groups){groups.length>0&&($scope.selectedGroup=groups[0]),$scope.groups=groups}),$scope.stepTypes=[{name:"process",displayedName:"[ ]",description:"Process"},{name:"decision",displayedName:"<>",description:"Decision"},{name:"wait",displayedName:"{ }",description:"Wait"},{name:"divergent_process",displayedName:"( )",description:"Divergent Process"}],$scope.regions=[{name:"independent",displayName:"Independent"},{name:"surrogate",displayName:"Surrogate"},{name:"direct_shared",displayName:"Direct Shared"},{name:"direct_leading",displayName:"Direct Leading"}],$scope.predecessorTypes=[{name:"normal_relationship",displayName:"Normal"},{name:"loose_temporal_relationship",displayName:"Loose Temporal"}],$scope.valueSpecificOptions=[{name:-3,displayName:"☹☹☹"},{name:-2,displayName:"☹☹"},{name:-1,displayName:"☹"},{name:0,displayName:"O"},{name:1,displayName:"☺"},{name:2,displayName:"☺☺"},{name:3,displayName:"☺☺☺"}],$scope.valueGenericOptions=[{name:-3,displayName:"-$$$"},{name:-2,displayName:"-$$"},{name:-1,displayName:"-$"},{name:0,displayName:"O"},{name:1,displayName:"$"},{name:2,displayName:"$$"},{name:3,displayName:"$$$"}],$scope.diagram=PCN.initPCN("","",""),$scope.diagram.domains=[PCN.initDomain("","Provider"),PCN.initDomain("","Customer")],$scope.diagram.steps=[PCN.initStep($scope.diagram.domains[1],"",$scope.regions[0].name,null)],$scope.lastSelectedDomain=$scope.diagram.domains[1],$scope.stepPredecessors={},$scope.addDomain=function(){$scope.diagram.domains.push(PCN.initDomain("",""))},$scope.addStep=function(){var steps=$scope.diagram.steps,lastStep=steps[steps.length-1],newStep=PCN.initStep($scope.lastSelectedDomain,"",$scope.regions[0].name,null);newStep.predecessors.push(PCN.initPredecessor(lastStep.id,$scope.predecessorTypes[0].name,"")),steps.push(newStep),$scope.stepPredecessors=getStepPredecessorsFromDiagram($scope.diagram)},$scope.deleteStep=function(index){$scope.diagram.steps.splice(index,1)},$scope.getDomainFromId=function(domainId){for(var i=0;i<$scope.diagram.domains.length;i++)if($scope.diagram.domains[i].id===domainId)return $scope.diagram.domains[i]},$scope.changeStepDomain=function(step,domain){step.domain.id=domain.id,$scope.lastSelectedDomain=domain},$scope.create=function(){var diagram=new Diagrams({metadata:{title:this.diagram.metadata.title,description:this.diagram.metadata.description,author:$scope.authentication.user.displayName},group:this.selectedGroup._id,domains:this.diagram.domains,steps:this.diagram.steps});diagram.$save(function(response){$location.path("diagrams/"+response._id),$scope.title="",$scope.description=""},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.remove=function(diagram){if(diagram){diagram.$remove();for(var i in $scope.diagrams)$scope.diagrams[i]===diagram&&$scope.diagrams.splice(i,1)}else $scope.diagram.$remove(function(){$location.path("diagrams")})},$scope.update=function(){var diagram=$scope.diagram;diagram.group=$scope.selectedGroup,diagram.$update(function(){$location.path("diagrams/"+diagram._id)},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.updatePredecessors=function(){for(var j=0;j<$scope.diagram.steps.length;j++){var step=$scope.diagram.steps[j];if("object"==typeof $scope.stepPredecessors[step.id]){step.predecessors=[];for(var numPredecessors=Object.keys($scope.stepPredecessors[step.id]).length,i=0;numPredecessors>i;i++){var predecessorId=Object.keys($scope.stepPredecessors[step.id])[i];$scope.stepPredecessors[step.id][predecessorId]&&step.predecessors.push(PCN.initPredecessor(predecessorId,$scope.predecessorTypes[0].name,""))}}}},$scope.deleteAllPredecessorsForStep=function(step){step.predecessors=[],delete $scope.stepPredecessors[step.id]},$scope.allStepsExceptMe=function(step){for(var steps=[],i=0;i<$scope.diagram.steps.length;i++)$scope.diagram.steps[i].id!==step.id&&steps.push($scope.diagram.steps[i]);return steps},$scope.updateStepRegions=function(){for(var i=0;i<$scope.diagram.steps.length;i++){var step=$scope.diagram.steps[i],stepType=step.domain.region.type,owner=$scope.getDomainFromId(step.domain.id),relatedID=owner.id===$scope.diagram.domains[0].id?$scope.diagram.domains[1].id:$scope.diagram.domains[0].id,related=$scope.getDomainFromId(relatedID);step.domain=PCN.initStepDomain(owner,stepType,related)}},$scope.find=function(){$scope.diagrams=Diagrams.query()},$scope.findOne=function(){$scope.groups=Groups.query();var promise=Diagrams.get({diagramId:$stateParams.diagramId});promise.$promise.then(function(diagram){$scope.diagram=diagram,$scope.selectedGroup=null,$scope.stepPredecessors={},$scope.lastSelectedDomain=$scope.diagram.domains[1];for(var i=0;i<$scope.groups.length;i++)if($scope.groups[i]._id===$scope.diagram.group._id){$scope.selectedGroup=$scope.groups[i];break}$scope.stepPredecessors=getStepPredecessorsFromDiagram($scope.diagram)})}}]),angular.module("diagrams").directive("pcnGrapher",[function(){return{restrict:"E",replace:!0,template:"<div></div>",scope:{diagramId:"@"},link:function(scope,element,attrs){attrs.$observe("diagramId",function(value){value&&element.html('<object class="pcn-grapher-directive" data="/diagrams/'+value+'/graph" type="image/svg+xml"></object>')})}}}]),angular.module("diagrams").directive("tasks",["$document",function(){return{restrict:"E",replace:!0,link:function(){},templateUrl:"/modules/diagrams/views/tasks-diagram.client.partial-view.html"}}]),angular.module("diagrams").filter("domainTitle",function(){return function(domain){return domain.title||domain.subtitle||"Unknown domain"}}),angular.module("diagrams").factory("Diagrams",["$resource",function($resource){return $resource("diagrams/:diagramId",{diagramId:"@_id"},{update:{method:"PUT"}})}]),angular.module("diagrams").factory("PCN",["uuid",function(uuid){return{CONSTANTS:{PREDECESSOR_TYPES:{NORMAL:"normal_relationship",LOOSE:"loose_temporal_relationship"},CONNECTOR:{INDEPENDENT:"",SURROGATE:"",DIRECT_LEADING:"direct_leading",DIRECT_SHARED:"direct_shared"}},initPCN:function(title,description,author){return{metadata:{title:title,description:description,author:author},domains:[],steps:[]}},initStep:function(domain,title,regionType,relatedDomain){if(!domain)throw new Error("Bad caller: required domain");var step={id:uuid.generate(),title:title,type:"process",emphasized:!1,value_specific:0,value_generic:0,predecessors:[],domain:{id:domain.id,region:{type:regionType}},problems:[]};return relatedDomain&&(step.domain.region.with_domain=relatedDomain.id),step},initPredecessor:function(id,type,title){return{id:id,type:type,title:title}},initStepDomain:function(owner,type,related){return owner||(owner={}),related||(related={}),{id:owner.id,region:{type:type,with_domain:related.id}}},initDomain:function(title,subtitle){return{id:uuid.generate(),title:title,subtitle:subtitle}}}}]),angular.module("diagrams").factory("uuid",[function(){return{generate:function(){var time=(new Date).getTime(),sixteen=16;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(match){var remainder=(time+sixteen*Math.random())%sixteen|0;return time=Math.floor(time/sixteen),("x"===match?remainder:7&remainder|8).toString(sixteen)})}}}]),angular.module("groups").run(["Menus",function(Menus){Menus.addMenuItem("topbar","Groups","groups","dropdown","/groups(/create)?"),Menus.addSubMenuItem("topbar","groups","List Groups","groups"),Menus.addSubMenuItem("topbar","groups","New Group","groups/create")}]),angular.module("groups").config(["$stateProvider",function($stateProvider){$stateProvider.state("listGroups",{url:"/groups",templateUrl:"modules/groups/views/list-groups.client.view.html"}).state("createGroup",{url:"/groups/create",templateUrl:"modules/groups/views/create-group.client.view.html"}).state("viewGroup",{url:"/groups/:groupId",templateUrl:"modules/groups/views/view-group.client.view.html"}).state("editGroup",{url:"/groups/:groupId/edit",templateUrl:"modules/groups/views/edit-group.client.view.html"})}]),angular.module("groups").controller("GroupsController",["$scope","$stateParams","$location","Authentication","Groups",function($scope,$stateParams,$location,Authentication,Groups){$scope.authentication=Authentication,$scope.create=function(){var group=new Groups({name:this.name,members:this.members});group.$save(function(response){$scope.name="",$location.path("groups/"+response._id)},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.remove=function(group){if(group){group.$remove();for(var i in $scope.groups)$scope.groups[i]===group&&$scope.groups.splice(i,1)}else $scope.group.$remove(function(){$location.path("groups")})},$scope.removeMember=function(member){$scope.group.members=$scope.group.members.filter(function(currentMember){return currentMember.username!==member.username})},$scope.update=function(){var group=$scope.group,members=group.members.map(function(member){return member.username});group.members=members.concat($scope.addMembers),group.$update(function(){$location.path("groups/"+group._id)},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.find=function(){$scope.groups=Groups.query()},$scope.findOne=function(){$scope.group=Groups.get({groupId:$stateParams.groupId})}}]),angular.module("groups").factory("Groups",["$resource",function($resource){return $resource("groups/:groupId",{groupId:"@_id"},{update:{method:"PUT"}})}]),angular.module("users").config(["$httpProvider",function($httpProvider){$httpProvider.interceptors.push(["$q","$location","Authentication",function($q,$location,Authentication){return{responseError:function(rejection){switch(rejection.status){case 401:Authentication.user=null,$location.path("signin");break;case 403:}return $q.reject(rejection)}}}])}]),angular.module("users").config(["$stateProvider",function($stateProvider){$stateProvider.state("profile",{url:"/settings/profile",templateUrl:"modules/users/views/settings/edit-profile.client.view.html"}).state("password",{url:"/settings/password",templateUrl:"modules/users/views/settings/change-password.client.view.html"}).state("accounts",{url:"/settings/accounts",templateUrl:"modules/users/views/settings/social-accounts.client.view.html"}).state("signup",{url:"/signup",templateUrl:"modules/users/views/authentication/signup.client.view.html"}).state("signin",{url:"/signin",templateUrl:"modules/users/views/authentication/signin.client.view.html"}).state("forgot",{url:"/password/forgot",templateUrl:"modules/users/views/password/forgot-password.client.view.html"}).state("reset-invlaid",{url:"/password/reset/invalid",templateUrl:"modules/users/views/password/reset-password-invalid.client.view.html"}).state("reset-success",{url:"/password/reset/success",templateUrl:"modules/users/views/password/reset-password-success.client.view.html"}).state("reset",{url:"/password/reset/:token",templateUrl:"modules/users/views/password/reset-password.client.view.html"})}]),angular.module("users").controller("AuthenticationController",["$scope","$http","$location","Authentication",function($scope,$http,$location,Authentication){$scope.authentication=Authentication,$scope.authentication.user&&$location.path("/"),$scope.signup=function(){$http.post("/auth/signup",$scope.credentials).success(function(response){$scope.authentication.user=response,$location.path("/")}).error(function(response){$scope.error=response.message})},$scope.signin=function(){$http.post("/auth/signin",$scope.credentials).success(function(response){$scope.authentication.user=response,$location.path("/")}).error(function(response){$scope.error=response.message})}}]),angular.module("users").controller("PasswordController",["$scope","$stateParams","$http","$location","Authentication",function($scope,$stateParams,$http,$location,Authentication){$scope.authentication=Authentication,$scope.authentication.user&&$location.path("/"),$scope.askForPasswordReset=function(){$scope.success=$scope.error=null,$http.post("/auth/forgot",$scope.credentials).success(function(response){$scope.credentials=null,$scope.success=response.message}).error(function(response){$scope.credentials=null,$scope.error=response.message})},$scope.resetUserPassword=function(){$scope.success=$scope.error=null,$http.post("/auth/reset/"+$stateParams.token,$scope.passwordDetails).success(function(response){$scope.passwordDetails=null,Authentication.user=response,$location.path("/password/reset/success")}).error(function(response){$scope.error=response.message})}}]),angular.module("users").controller("SettingsController",["$scope","$http","$location","Users","Authentication",function($scope,$http,$location,Users,Authentication){$scope.user=Authentication.user,$scope.user||$location.path("/"),$scope.hasConnectedAdditionalSocialAccounts=function(){for(var i in $scope.user.additionalProvidersData)return!0;return!1},$scope.isConnectedSocialAccount=function(provider){return $scope.user.provider===provider||$scope.user.additionalProvidersData&&$scope.user.additionalProvidersData[provider]},$scope.removeUserSocialAccount=function(provider){$scope.success=$scope.error=null,$http.delete("/users/accounts",{params:{provider:provider}}).success(function(response){$scope.success=!0,$scope.user=Authentication.user=response}).error(function(response){$scope.error=response.message})},$scope.updateUserProfile=function(isValid){if(isValid){$scope.success=$scope.error=null;var user=new Users($scope.user);user.$update(function(response){$scope.success=!0,Authentication.user=response},function(response){$scope.error=response.data.message})}else $scope.submitted=!0},$scope.changeUserPassword=function(){$scope.success=$scope.error=null,$http.post("/users/password",$scope.passwordDetails).success(function(){$scope.success=!0,$scope.passwordDetails=null}).error(function(response){$scope.error=response.message})}}]),angular.module("users").factory("Authentication",[function(){var _this=this;return _this._data={user:window.user},_this._data}]),angular.module("users").factory("Users",["$resource",function($resource){return $resource("users",{},{update:{method:"PUT"}})}]);