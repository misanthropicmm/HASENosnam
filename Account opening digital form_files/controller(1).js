/**
 * Controllers
 * @module controllers
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * Main controller
     * @ngInject
     * @constructor
     */
    function OnboardingPropertiesCtrl($scope, lpCoreUtils, lpWidget) {
        
        var locale = localStorage.getItem('locale');
        var checkLestFiles = [
            'CharitableOrganisationButton',
            'ListedOnStockExchangeButton',
            'NotListedOnStockExchangeHkButton',
            'NotListedOnStockExchangeOverseasButton',
            'OwnersIncorporationButton',
            'ReligiousGroupButton',
            'SchoolButton',
            'SocietyClubOrAssociationButton',
            'SolePropHkButton',
            'SolePropOverseasButton',
            'TradeUnionButton',
            'UnincorporatedJointVentureButton',
        ];
        var documentChecklistData = {};
        var key;
        var languageSufix = 'En';
        languageSufix = (locale === 'zh-hk') ? 'Hk' : ((locale === 'zh-cn') ? 'Cn' : languageSufix);
        for(key in checkLestFiles) {
            var proName = checkLestFiles[key] + languageSufix;
            proName = proName.toString();
            var propValue = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference(proName));
            documentChecklistData[checkLestFiles[key]] = propValue;

        }
        localStorage.setItem('documentChecklist', JSON.stringify(documentChecklistData));
        
        var portalType = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('PortalType'));
        localStorage.setItem('PortalType', portalType);
    }

    module.exports = OnboardingPropertiesCtrl;
});
