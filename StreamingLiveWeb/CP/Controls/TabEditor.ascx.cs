using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP.Controls
{
    public partial class TabEditor : System.Web.UI.UserControl
    {

        public event EventHandler DataUpdated;
        public JObject Data;
        JArray tabs;

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public void Populate()
        {
            tabs = (JArray)Data["tabs"];
            TabRepeater.DataSource = tabs;
            TabRepeater.DataBind();
            TabEditHolder.Visible = false;
            TabListHolder.Visible = true;
        }


        protected void TabRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            tabs = (JArray)Data["tabs"];

            if (e.CommandName == "Edit")
            {
                EditTabShow(e.Item.ItemIndex);
            }
            else if (e.CommandName == "Up")
            {
                JObject tab = (JObject)tabs[e.Item.ItemIndex];
                tabs.RemoveAt(e.Item.ItemIndex);
                tabs.Insert(e.Item.ItemIndex - 1, tab);
                UpdateData();
            }
            else if (e.CommandName == "Down")
            {
                JObject tab = (JObject)tabs[e.Item.ItemIndex];
                tabs.RemoveAt(e.Item.ItemIndex);
                tabs.Insert(e.Item.ItemIndex + 1, tab);
                UpdateData();
            }
        }

        private void EditTabShow(int idx)
        {
            tabs = (JArray)Data["tabs"];
            JObject tab = (idx == -1) ? new JObject() : (JObject)tabs[idx];
            TabEditHolder.Visible = true;
            TabListHolder.Visible = false;

            TabIndexHid.Value = idx.ToString();

            try
            {
                TabType.SelectedValue = Convert.ToString(tab["type"]);
            }
            catch { }
            TabTextText.Text = Convert.ToString(tab["text"]);
            DeleteTabHolder.Visible = idx > -1;

            PopulateTabDetails(tab);
        }

        private void PopulateTabDetails(JObject tab)
        {
            TabUrlHolder.Visible = false;
            PageHolder.Visible = false;

            if (tab["icon"] != null) TabIcon.Attributes["data-icon"] = tab["icon"].ToString();

            if (TabType.SelectedValue == "url")
            {
                TabUrlHolder.Visible = true;
                TabUrlText.Text = Convert.ToString(tab["url"]);
            }
            else if (TabType.SelectedValue == "page")
            {
                PageHolder.Visible = true;
                PageList.DataSource = StreamingLiveLib.Pages.LoadBySiteId(AppUser.Current.Site.Id.Value);
                PageList.DataBind();
                try
                {
                    PageList.SelectedValue = tab["data"].ToString();
                }
                catch { }
            }
        }


        protected void SaveTabButton_Click(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(TabIndexHid.Value);
            JArray tabs = (JArray)Data["tabs"];
            JObject tab = (idx == -1) ? new JObject() : (JObject)tabs[idx];
            tab["url"] = TabUrlText.Text;
            tab["type"] = TabType.SelectedValue;
            tab["data"] = (TabType.SelectedValue == "page") ? PageList.SelectedValue : "";
            tab["text"] = TabTextText.Text;
            tab["icon"] = Request["TabIcon"];

            if (TabType.SelectedValue == "page")
            {
                tab["url"] = $"/data/{AppUser.Current.Site.KeyName}/page{PageList.SelectedValue}.html";
            }

            if (TabType.SelectedValue == "chat") tab["url"] = "/chat.html";
            if (TabType.SelectedValue == "prayer") tab["url"] = "/prayer.html";


            if (idx == -1) tabs.Add(tab);
            UpdateData();
            Populate();
        }

        protected void DeleteTabButton_Click(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(TabIndexHid.Value);
            if (idx > -1)
            {
                JArray tabs = (JArray)Data["tabs"];
                tabs.RemoveAt(idx);
                UpdateData();
            }
            Populate();
        }

        protected void CancelTabButton_Click(object sender, EventArgs e)
        {
            Populate();
        }

        protected void AddTabLink_Click(object sender, EventArgs e)
        {
            EditTabShow(-1);
        }

        protected void TabType_SelectedIndexChanged(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(TabIndexHid.Value);
            JArray tabs = (JArray)Data["tabs"];
            JObject tab = (idx == -1) ? new JObject() : (JObject)tabs[idx];
            PopulateTabDetails(tab);
        }

        private void UpdateData()
        {
            DataUpdated(null, null);
        }

        protected void TabRepeater_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            LinkButton UpButton = (LinkButton)e.Item.FindControl("UpButton");
            LinkButton DownButton = (LinkButton)e.Item.FindControl("DownButton");
            if (e.Item.ItemIndex == 0) UpButton.Visible = false;
            if (e.Item.ItemIndex == tabs.Count - 1) DownButton.Visible = false;
        }
    }
}