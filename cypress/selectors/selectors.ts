export const GlobalSelectors = {
  toast: ".go3958317564",
  button_confirm: '#button_confirm',
  modal_button_cancel: '#button_cancel',
  button_scroll: '#button_scrollToTop',
  hearIcon_empty: '#heartIcon_empty',
  hearIcon_full: '#heartIcon_full',
  tooltip_heart: '#tooltip_heart'
}
export const NavItemSelectors = {
  navbar: "#navbar_main",
  footer: "#footer_main",

  home_navitem: "#Home_navitem",
  vehicleCheck_navitem: "#VehicleCheck_navitem",
  savedVehicles_navitem: "#SavedVehicles_navitem",
  representatives_navitem: "#Representatives_navitem",
  avatar_navitem: 'button[aria-haspopup="menu"]',
  avatar_menuitem_profile: 'a[href="/profile"]',
  avatar_menuitem_settings: 'a[href="/settings"]',
  button_logout: "#logout_navitem",

  menu_mobile: '#menu_icon',
  x_icon: '#x_icon',
  panel: '#menu_panel',
  home_panelitem: "#Home_panelitem",
  vehicleCheck_panelitem: "#VehicleCheck_panelitem",
  logout_panelitem: "#logout_panelitem"
}

export const LoginSelectors = {
  input_email: "#input_email",
  input_password: "#input_password",
  checkbox_login: "#checkbox_login",
  button_login: "#button_login",
  button_registerPage: "#button_registerPage"
}
export const RegisterSelectors = {
  input_email: "#input_email",
  input_username: "#input_username",
  input_password: "#input_password",
  input_repeatPassword: "#input_repeatPassword",
  button_generateAvatar: "#button_generateAvatar",
  img_avatar: "#register_avatarimg",
  checkbox_register: "#checkbox_register",
  button_register: "#button_register",
  button_backToLogin: "#button_backToLogin"
}

export const HomePageSelectors = {
  pic_vehicleCheck: 'a.portfolio-link[href="vehicles"]',
  pic_savedVehicles: 'a.portfolio-link[href="savedvehicles"]',
  pic_representatives: 'a.portfolio-link[href="representatives"]',

  section_contact: 'section#contact',
  input_name: 'input#name',
  input_email: 'input#email',
  input_phone: 'input#phone',
  textarea_message: 'textarea#message',
  button_sendMessage: 'button#sendMessageButton',

  teamMembers: 'div.team-member',

  socials_twitter: 'a[href="#twitter"]',
  socials_facebook: 'a[href="#facebook"]',
  socials_linkedin: 'a[href="#linkedin"]',

  footer_copyright: "#footer_copyright",
  footer_contact: "#footer_contact",
  footer_terms: "#footer_terms",
  footer_privacy: "#footer_privacy"
}

export const VehicleCheckSelectors = {
  input_search: '#input_vehicle_check',
  button_search: '#search_vehicle_check',
  label_RegNum: "#label_typeRegNum",
  span_RegNum: "#registration_number",

  label_Tax: "#details_label_TAX",
  label_TaxDue: "#details_label_TAXdue",
  label_Mot: "#details_label_MOT",
  label_MotExpires: "#details_label_MOTExpires",
  label_MotExpired: "#details_label_MOTExpired",
  label_Make: "#details_label_Make",
  label_DateOfReg: "#details_label_DateofRegistration",
  label_YearOfMan: "#details_label_Yearofmanufacture",
  label_Cylinder: "#details_label_Cylindercapacity",
  label_Co2: "#details_label_CO₂emissions",
  label_Fuel: "#details_label_Fueltype",
  label_Euro: "#details_label_Eurostatus",
  label_RDE: "#details_label_RealDrivingEmissions",
  label_Export: "#details_label_ExportMarker",
  label_VehStatus: "#details_label_Vehiclestatus",
  label_VehColor: "#details_label_Vehiclecolour",
  label_TypeApproval: "#details_label_Vehicletypeapproval",
  label_Wheelplan: "#details_label_Wheelplan",
  label_RevWeight: "#details_label_Revenueweight",
  label_V5C: "#details_label_DateoflastV5Clogbookissued",
  label_AdditionalRates: "#details_label_AdditionalRateapplicableuntil",

  value_Tax: "#details_TAX_value",
  value_TaxDue: "#details_TAXdue_value",
  value_Mot: "#details_MOT_value",
  value_MotExpires: "#details_MOTExpires_value",
  value_MotExpired: "#details_MOTExpired_value",
  value_Make: "#details_Make_value",
  value_DateOfReg: "#details_DateofRegistration_value",
  value_YearOfMan: "#details_Yearofmanufacture_value",
  value_Cylinder: "#details_Cylindercapacity_value",
  value_Co2: "#details_CO₂emissions_value",
  value_Fuel: "#details_Fueltype_value",
  value_Euro: "#details_Eurostatus_value",
  value_RDE: "#details_RealDrivingEmissions_value",
  value_Export: "#details_ExportMarker_value",
  value_VehStatus: "#details_Vehiclestatus_value",
  value_VehColor: "#details_Vehiclecolour_value",
  value_TypeApproval: "#details_Vehicletypeapproval_value",
  value_Wheelplan: "#details_Wheelplan_value",
  value_RevWeight: "#details_Revenueweight_value",
  value_V5C: "#details_DateoflastV5Clogbookissued_value",
  value_AdditionalRates: "#details_AdditionalRateapplicableuntil_value",
}

export const SavedVehiclesSelectors = {
  noVehAdded: "noVehAdded", //data-cy
  button_goToVehCheck: "button_goToVehCheck", //data-cy
  input_filter: "input_filterSavedVehicles", //data-cy
  container_SavedCars: "container_SavedCars", //data-cy

  span_regNum: "span_registrationNumber", //data-cy
  p_make: "p_make", //data-cy
  p_year: "p_year", //data-cy
  button_details: "button_details", //data-cy
  button_delete: "button_delete", //data-cy

  button_pageDropdown: "button_pageDropdown", //data-cy
  dropdown_menu_items: "dropdown_menu_items", //data-cy
  paginationItem: "pagination_item", //data-cy

  button_back: "button_back", //data-cy
}

export const RepresentativesSelectors = {
  emptyReps: "empty_representatives", //data-cy
}

export const ProfileSelectors = {
  label_firstName: "#label_firstName",
  input_firstName: "#input_firstName",
  label_lastName: "#label_lastName",
  input_lastName: "#input_lastName",
  label_email: "#label_email",
  input_email: "#input_email",
  label_username: "#label_username",
  input_username: "#input_username",
  label_phoneNum: "#label_phoneNum",
  input_phoneNum: "#input_phoneNum",
  select_country: "#select_country",
  label_company: "#label_company",
  input_company: "#input_company",
  label_aboutme: "#label_aboutme",
  input_aboutme: "#textareae_aboutme",
  button_changeAvatar: "#button_changeAvatar",
  button_save: "#button_save",
  button_navigateToSettings: "#button_navigateToSettings",
  avatar_profilePage_container: "#avatar_profilePage_container"
}

export const SettingsSelectors = {
  group_darkMode: "#group_darkMode",
  group_notifications: "#group_notifications",
  button_navigateToProfile: "#button_navigateToProfile"
}