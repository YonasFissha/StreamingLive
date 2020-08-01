using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.Adapters;

namespace StreamingLiveWeb
{
    public class DropDownListAdapter : WebControlAdapter
    {
        protected override void RenderContents(HtmlTextWriter writer)
        {
            var list = (DropDownList)this.Control;
            string currentOptionGroup;
            var renderedOptionGroups = new List<string>();
            foreach (ListItem item in list.Items)
            {
                Page.ClientScript.RegisterForEventValidation(list.UniqueID, item.Value);
                //Is the item part of an option group?
                if (!string.IsNullOrEmpty(item.Attributes["OptionGroup"]))
                {
                    currentOptionGroup = item.Attributes["OptionGroup"];
                    //Was the option header already written, then just render the list item
                    if (renderedOptionGroups.Contains(currentOptionGroup))
                    {
                        RenderListItem(item, writer);
                    }
                    //The header was not written,do that first
                    else
                    {
                        //Close previous group
                        if (renderedOptionGroups.Count > 0)
                        {
                            RenderOptionGroupEndTag(writer);
                        }
                        RenderOptionGroupBeginTag(currentOptionGroup, writer);
                        renderedOptionGroups.Add(currentOptionGroup);
                        RenderListItem(item, writer);
                    }
                }
                //Simple separator
                else if (item.Text == "--")
                {
                    RenderOptionGroupBeginTag("--", writer);
                    RenderOptionGroupEndTag(writer);
                }
                //Default behavior, render the list item as normal
                else
                {
                    RenderListItem(item, writer);
                }
            }
            if (renderedOptionGroups.Count > 0)
            {
                RenderOptionGroupEndTag(writer);
            }
        }
        private void RenderOptionGroupBeginTag(string name, HtmlTextWriter writer)
        {
            writer.WriteBeginTag("optgroup");
            writer.WriteAttribute("label", name);
            writer.Write(HtmlTextWriter.TagRightChar);
            writer.WriteLine();
        }
        private void RenderOptionGroupEndTag(HtmlTextWriter writer)
        {
            writer.WriteEndTag("optgroup");
            writer.WriteLine();
        }
        private void RenderListItem(ListItem item, HtmlTextWriter writer)
        {
            writer.WriteBeginTag("option");
            writer.WriteAttribute("value", item.Value, true);
            if (item.Selected)
            {
                writer.WriteAttribute("selected", "selected", false);
            }
            foreach (string key in item.Attributes.Keys)
            {
                writer.WriteAttribute(key, item.Attributes[key]);
            }
            writer.Write(HtmlTextWriter.TagRightChar);
            HttpUtility.HtmlEncode(item.Text, writer);
            writer.WriteEndTag("option");
            writer.WriteLine();
        }
    }
}