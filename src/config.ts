import { IListConfig } from 'components/list';
import { IAppConfig } from 'components/app';
import { IFormConfig } from 'components/form';
import { IFormItemStaticValueConfig } from 'components/form-item/types/staticValue.container';

let appConfig: IAppConfig = {
	menu: {
		items: [{
			label: "Pages",
			items: [{
				label: "About Us",
				pageName: "AboutUs"
			}]
		}, {
			label: "Content",
			items: [{
				label: "About - Team Members",
				pageName: "TeamMembers"
			}]
		}]
	},
	pages: {
		AboutUs: {
			parts: {
				Form: <IFormConfig> {
					type: "Form",
					label: "About Us",
					isResetEnabled: true,
					isClearEnabled: false,
					isRemoveEnabled: false,
					formItems: {
						Type: <IFormItemStaticValueConfig> {
							type: "Static",
							value: "AboutUs"			
						}
					}
				}
			}
		},
		TeamMembers: {
			parts: {
				List: <IListConfig>{
					type: "List",
					label: "Team Members",
					query: {
						typeFilter: "TeamMember"
					},
					itemMap: {
						title: "FullName"
					}
				},
				Form: <IFormConfig> {
					type: "Form",
					label: "About Us - Team Member",
					isResetEnabled: true,
					isClearEnabled: false,
					isRemoveEnabled: false,
					formItems: {
						FullName: {
							type: "SingleLineText",
							label: "Full Name"
						},
						// SeoDescription: {
						// 	type: "MultiLineText",
						// 	label: "SEO Meta Description"
						// },	
						// },{
						// 	Name: "HeroImage",
						// 	Label: "Hero Image",
						// 	Type: "MediaSelector",
						// 	SelectText: "Select Image"
						// },{
						// 	Name: "MissionHeader",
						// 	Label: "Mission Header"
						// },{
						// 	Name: "MissionContent",
						// 	Label: "Mission Content",
						// 	Type: "FormattedText"
						// },{
						// 	Name: "StoryHeader",
						// 	Label: "Story Header"
						// },{
						// 	Name: "StoryContent",
						// 	Label: "Story Content",
						// 	Type: "FormattedText"
						// },{
						// 	Name: "StoryImage",
						// 	Label: "Story Image",
						// 	Type: "MediaSelector",
						// 	SelectText: "Select Image"
						// },{
						// 	Name: "ProductsHeader",
						// 	Label: "Products Header"
						// },{
						// 	Name: "ProductsContent",
						// 	Label: "Products Content",
						// 	Type: "FormattedText"
						// },{
						// 	Name: "ProductsList",
						// 	Label: "Products List",
						// 	Type: "FormattedText"
						// },{
						// 	Name: "PartnersHeader",
						// 	Label: "Partners Header"
						// },{
						// 	Name: "PartnersList",
						// 	Label: "Partners List",
						// 	Type: "FormattedText"
						// },{
						// 	Name: "TeamHeader",
						// 	Label: "Team Header"
						// },{
						// 	Name: "TeamContent",
						// 	Label: "Team Content",
						// 	Type: "FormattedText"
						// },
						Type: <IFormItemStaticValueConfig>{
							type: "Static",
							value: "TeamMember"
						}
					}
				}
			}
		}
	}
}

export default appConfig;