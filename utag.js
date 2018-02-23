<!-- The utag.sync.js script should run as early as possible, preferably
 in the head of the document. See the Sample HTML for more information -->
<script src="//tags.tiqcdn.com/utag/hsbc/hk-cmb-hangseng/dev/utag.sync.js"></script>

<script type="text/javascript">
var utag_data = {
  site_region : "", // Geographic region e.g. &quot;Europe&quot;
  site_subregion : "", // Geographic subregion e.g. &quot;Rest of Europe&quot;
  site_country : "", // Country of the site e.g. &quot;Malta&quot;
  site_entity : "", // Financial entity of the site e.g. &quot;HSBC Bank Malta plc&quot;
  site_brand : "", // Brand represented on site e.g. &quot;HSBC&quot;
  page_language : "", // Language of the page e.g. &quot;en&quot;
  page_security_level : "", // Security level of the page e.g. &quot;0&quot; for public
  webtrends_dcsid : "", // Webtrends DCSID, can be set dynamically
  page_category : "", // Page category e.g. &quot;Public;No IBType&quot;
  page_section : "", // Page section e.g. &quot;Public&quot; or &quot;Homepage&quot;
  page_customer_group : "", // Customer group e.g. &quot;PFS&quot;
  page_business_line : "", // Business line e.g. &quot;General;Premier;Advance&quot;
  page_ib_type : "", // Internet Banking type e.g. &quot;No ibtype&quot;
  page_url : "", // Page URL, used for masked pages
  page_screenlayout : "", // Page screen layout for responsive, &quot;slim&quot; or &quot;full&quot;
  product_id : "", // Contains product ID(s) - multiple values should be comma-separated.
  product_sku : "", // Contains product SKU(s) - multiple values should be comma-separated.
  product_name : "", // Contains product name(s) - multiple values should be comma-separated.
  product_brand : "", // Contains product brand(s) - multiple values should be comma-separated.
  product_category : "", // Contains product category(s) - multiple values should be comma-separated.
  product_subcategory : "", // Contains product subcategory(s) - multiple values should be comma-separated.
  product_unit_price : "", // Contains product unit price(s) - multiple values should be comma-separated.
  product_quantity : "", // Contains product quantity(s) - multiple values should be comma-separated.
  product_discount : "", // Contains product discount(s) - multiple values should be comma-separated.
  order_id : "", // Contains the order or transaction ID.
  order_total : "", // Contains the order total value.
  order_subtotal : "", // Contains the order subtotal (not containing taxes &amp; shipping).
  order_payment_type : "", // Contains the order payment type.
  order_shipping : "", // Contains the order shipping value.
  order_tax : "", // Contains the order tax amount.
  order_currency : "", // Contains the currency associated with the transaction, e.g. 'USD'.
  order_coupon_code : "", // Contains the order coupon code.
  order_store : "", // Contains identification information for a store.
  order_type : "", // Contains type of order/cart.
  customer_id : "", // Contains the customer ID.
  customer_city : "", // Contains the customer city.
  customer_state : "", // Contains the customer state.
  customer_zip : "", // Contains the customer zip/postal code.
  customer_country : "", // Contains the customer country.
  customer_email : "", // Contains the customer email.
  customer_type : "", // Contains the customer type.
  product_event : "", // Product event: &quot;v&quot; for view, &quot;a&quot; for add to cart and the HSBC values apst (application start), apsu (application submit) and trco (transaction complete)
  site_domain_type : "", // Site domain type: &quot;prod&quot; or &quot;test&quot;
  webtrends_test_dcsid : "", // Webtrends DCSID for staging environments
  page_ad_display : "", // Page ad IDs displayed, semicolon separated
  page_ad_click : "", // Ad ID of click, from the WT.ac query parameter
  webtrends_dcsqry : "", // Webtrends recorded query string
  page_referrer : "", // Page referrer url, with query string removed
  page_title : "", // Override of the HTML page title of the page
  page_channel : "", // The channel by which the user has viewed the page, e.g. mobileapp, tabletapp, web or staff
  wt_onsitedoms : "", // Domains used for off-site click tracking
  event_type : "", // The numerical code relating to the event type e.g. 0 = page, 99 = generic event
  event_content : "", // A further description of the action taken if it is not clear from just the event_action 
  page_layout : "", // screen type being viewed by user for responsive site, e.g. &quot;desktop&quot;, &quot;tablet&quot;, &quot;mobile&quot;, &quot;slim&quot;, &quot;full&quot;
  search_term : "", // Contains the search phrase/term the user has input
  search_results : "", // Contains the number of search results
  search_scope : "", // Contains the scope of the search - Used if you have options to filter what is being searched (e.g. 'all' or 'products')
  event_subcategory : "", // If further classification is required for the category this optional item can be used
  event_category : "", // The application category the event belongs to
  event_action : "", // The action being taken relevant to the application
  site_region_default : "", // Default value for site region, if not specified in page
  site_subregion_default : "", // Subregion, default if not specified in page
  site_country_default : "", // Country, default if not specified in page
  site_entity_default : "", // Business name, default if not specified in page
  site_brand_default : "", // Brand represented, default if not specified in page
  page_language_default : "", // Language, default if not specified on the page
  session_referrer : "", // Referrer from first hit in the session
  campaign_id : "", // External ad id from WT.mc_id parameter
  campaign_search_flag : "", // External search flag from WT.srch parameter
  account_type : "", // Type of account
  currency_amount : "", // Amount of currency
  country_code : "", // Country Code
  tool_name : "", // e.g. &quot;OnlineSurvey&quot;
  application_date : "", // Date that application was submitted
  application_id : "", // Unique reference number for this application. Add only to the final 
  application_time : "", // Time of day that application was submitted
  application_timestamp : "", // Timestamp from HSBC server when the application was submitted
  campaign_event : "", // Offsite campaign event: &quot;click&quot; for ad clickthrough event
  customer_group : "", // Contains the customer group related to the HSBC business line that the customer is interacting with e.g. 
  exchange_rate : "", // Exchange rate used for a sale or transaction
  form_field_name : "", // Contains the specific name (or label) of the field
  form_name : "", // Contains the specific name of the form that is being interacted with
  funnel_complete_flag : "", // Flag to identify the end of a funnel (should only accept '1' as it's value)
  funnel_name : "", // Scenario name, e.g. &quot;ProdConvAll&quot;
  funnel_step : "", // Scenario step by numeric ID, e.g. &quot;1&quot;
  funnel_step_name : "", // Scenario step by step name e.g. contact details
  media_name : "", // Media clip name
  media_type : "", // Media clip type e.g. 
  order_date : "", // Contains the date stamp of when the order was submitted
  order_time : "", // Contains the time stamp of when the order was submitted
  page_product_type : "", // Product line(s) represented on this page e.g. 
  page_subcategory : "", // Page sub category
  page_type : "", // The type of page e.g. &quot;form&quot;, &quot;landing&quot;, &quot;home&quot;, &quot;search&quot;, &quot;product&quot;
  page_version : "", // Used to identify which version of a page has been served to a user either through an optimisation test of as the content has changed through BAU
  site_type : "", // Set to &quot;single_page&quot; for single page apps so Tealium will handle correctly (not used for analytics in general)
  test_id : "", // Used to identify which optimisation test has been served to the user
  transaction_charge_type : "", // How charges are applied to a transaction debit|credit|shared
  transaction_currency_pair : "", // The two currency codes used for this transaction (debit account currency: transaction currency)
  transaction_date : "", // Date that application was submitted
  transaction_execution_type : "", // The execution type e.g. asap|specific|recurring
  transaction_id : "", // Unique reference number for this transaction. Add only to the final 
  transaction_purpose : "", // The purpose of the transaction (NO FREEFORM CAPTURE)
  transaction_time : "", // Time of day that application was submitted
  transaction_timestamp : "", // Timestamp from HSBC server when the Transaction was completed
  error_code : "", // The Error message/code/ ID of all the Errors generated on the page
  vam_id : "", // Value Added Messaging (VAM) - ID
  vam_action : "", // Value Added Messaging (VAM) - User Action e.g. display, accept, decline, like, dislike etc...
  video_id : "", // The specific ID of the video
  video_name : "", // The name of the Video
  video_duration : "", // The length of the video (in Seconds)
  transaction_total : "", // FX calculator output value
  branch_selected : "", // Selected HSBC branch in Branch locator pages
  business_inquiry : "", // The topic or type of question the business has as part of an inquiry
  business_name : "", // The name of the Business
  business_revenue_range : "", // The revenue rage of the Business
  business_industry : "", // The industry that the Business is in
  business_location : "", // The location of the Business
  business_market_interest : "", // The market(s) that the Business is interested in
  customer_gender : "", // The gender of the customer
  customer_year_of_birth : "", // The year the customer was born (ONLY the year,not month or day!)
  promotion_code : "", // Promotion code used
  adobe_trackingserver : "", // adobe : analytics : trackingserver
  adobe_analytics_orgid : "", // adobe : analytics : adobe org id (master id controlled by the effective adobe marketing cloud tag id)
  ut.session_id : "", // utag : effective session id
  ut.visitor_id : "", // utag : effective visitor id
  adobe_cloudserver : "", // adobe : analytics : cloud server name
  tool_event : "", // tool : event : usage (set by extension)
  registration_event : "", // registration : event (set by extension)
  application_event : "", // application : event : e.g. &quot;started&quot; | &quot;completed&quot; | &quot;accepted&quot; etc (set by extension)
  transaction_event : "", // transaction : event
  login_event : "", // login : event : e.g. to be set on successful login
  promotion_event : "", // promotion : event :  e.g. &quot;display&quot; | &quot;clicked&quot; (set by extension)
  TO_BE_DEFINED : "", // TODO : TO BE DEFINED
  page_name : "", // page : name (local language)
  site_category : "", // site : category
  time_parting : "", // time : parting - format e.g. &quot;05:12 PM|Wednesday&quot; (set by extension)
  token_usage : "", // token : usage e.g. DSK or PSK (set by extension)
  vam_event : "", // vam : event e.g. &quot;like&quot; or &quot;dislike&quot; (set by extension)
  tool_type : "", // tool : type (set by extension)
  lead_event : "", // lead : event e.g. 'complete' or 'captured' (set by extension)
  click_event : "", // click : event e.g. tab name or accordian name or offsite link name or file being downloaded
  transaction_name : "", // transaction : name
  currency_code : "", // currency : code
  site_section : "", // site : section
  adobe_errorpage : "", // adobe : 404 errorpage (pageType=errorPage)
  search_event : "", // search : event (set by extension)
  page_name_en : "", // page : name (english)
  page_percent_viewed : "", // page : percent viewed (set by extension)
  adobe_rsid : "", // adobe : analytics : effective report suite id (set by extension)
  adobe_analytics_idsync : "", // adobe : analytics : customer id sync
  lead_category : "", // lead : category e.g. 'internal_promotion' (set by extension)
  lead_action : "", // lead : action e.g. 'clickthrough' (set by extension)
  lead_content : "", // lead : content e.g. pid='12345' value (set by extension)
  promotion_category : "", // promotion : category e.g. 'internal' (set by extension)
  promotion_action : "", // promotion : action e.g. 'display' (set by extension)
  promotion_content : "", // promotion : content e.g. '12345,67890' (set by extension)
  click_content : "", // click : content e.g. tab name or accordian name or offsite link name or file being downloaded (set by extension)
  previous_page_name : "", // page : previous page name (set by extension)
  pid_category : "", // promotion : pid : category (set by extension)
  pid_action : "", // promotion : pid : action e.g. 'clickthrough' (set by extension)
  pid_content : "", // promotion : pid : content value e.g. 'HBMT_flexi_expressbanking201301' (set by extension)
  adobe_page_event : "", // product : event : page view (set by extension)
  adobe_session_event : "", // product : event : view once per visit per product (set by extension)
  search_category : "", // adobe : search : search trigger (set by extension)
  search_action : "", // adobe : search : result (set by extension)
  tmsLibVer_analytics : "", // References the currently deployed version of the library
  obfuscate_ip : "", // Data point used to signify to vendors that they should obfuscate the IP address of the user
  tmsLibVer_adobeanalytics : "", // 
  form_field_1 : "", // Recommended format is NameOfField:Value (Value MUST not be PII)
  form_field_2 : "", // Recommended format is NameOfField:Value (Value MUST not be PII)
  form_field_3 : "", // Recommended format is NameOfField:Value (Value MUST not be PII)
  form_field_4 : "", // Recommended format is NameOfField:Value (Value MUST not be PII)
  form_field_5 : "", // Recommended format is NameOfField:Value (Value MUST not be PII)
  adobe_analytics_multifactorevent : "", // Triggers events based on multiple conditions
  adobe_analytics_evar45 : "", // Manages eVar45 mapping
  adobe_mcvid : "", // 
  vendor_celebrus_collectionurl : "", // The URL to where data is sent within Celebrus
  vendor_celebrus_packet : "", // 
  vendor_celebrus_compact : "", // 
  vendor_celebrus_sslport : "", // 
  tmsLibVer_celebrus : "", // References the deployed library version on a profile
  vendor_celebrus_csaname : "", // 
  adobe_analytics_linkname : "" // 
}
</script>

<!-- Loading script asynchronously -->
<script type="text/javascript">
    (function(a,b,c,d){
    a='//tags.tiqcdn.com/utag/hsbc/hk-cmb-hangseng/dev/utag.js';
    b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;
    a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);
    })();
</script>

    