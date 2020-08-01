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
        StreamingLiveLib.Tabs tabs;

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        private void LoadData()
        {
            tabs = StreamingLiveLib.Tabs.LoadBySiteId(AppUser.Current.Site.Id);
        }

        public void Populate()
        {
            LoadData();

            TabRepeater.DataSource = tabs;
            TabRepeater.DataBind();

            TabEditHolder.Visible = false;
            TabListHolder.Visible = true;
        }


        protected void TabRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            if (e.CommandName == "Edit")
            {
                EditTabShow(Convert.ToInt32(e.CommandArgument));
            }
            else if (e.CommandName == "Up")
            {
                LoadData();
                tabs[e.Item.ItemIndex - 1].Sort = tabs[e.Item.ItemIndex - 1].Sort + 1;
                tabs[e.Item.ItemIndex].Sort = tabs[e.Item.ItemIndex].Sort - 1;
                tabs[e.Item.ItemIndex - 1].Save();
                tabs[e.Item.ItemIndex].Save();
                UpdateData();
            }
            else if (e.CommandName == "Down")
            {
                LoadData();
                tabs[e.Item.ItemIndex + 1].Sort = tabs[e.Item.ItemIndex + 1].Sort - 1;
                tabs[e.Item.ItemIndex].Sort = tabs[e.Item.ItemIndex].Sort + 1;
                tabs[e.Item.ItemIndex + 1].Save();
                tabs[e.Item.ItemIndex].Save();
                UpdateData();
            }
        }

        private void EditTabShow(int id)
        {
            StreamingLiveLib.Tab tab = (id == 0) ? new StreamingLiveLib.Tab() : StreamingLiveLib.Tab.Load(id, AppUser.Current.Site.Id);

            TabEditHolder.Visible = true;
            TabListHolder.Visible = false;

            TabIdHid.Value = tab.Id.ToString();
            TabTextText.Text = tab.Text;
            if (tab.Icon != "") TabIcon.Attributes["data-icon"] = tab.Icon;
            TabType.SelectedValue = tab.TabType;
            DeleteTabHolder.Visible = id > 0;

            PopulateTabDetails(tab);
        }

        private void PopulateTabDetails(StreamingLiveLib.Tab tab)
        {
            TabUrlHolder.Visible = false;
            PageHolder.Visible = false;

            if (TabType.SelectedValue == "url")
            {
                TabUrlHolder.Visible = true;
                TabUrlText.Text = tab.Url;
            }
            else if (TabType.SelectedValue == "page")
            {
                PageHolder.Visible = true;
                PageList.DataSource = StreamingLiveLib.Pages.LoadBySiteId(AppUser.Current.Site.Id);
                PageList.DataBind();
                try
                {
                    PageList.SelectedValue = tab.TabData;
                }
                catch { }
            }
        }


        protected void SaveTabButton_Click(object sender, EventArgs e)
        {
            int id = Convert.ToInt32(TabIdHid.Value);
            StreamingLiveLib.Tab tab = (id == 0) ? new StreamingLiveLib.Tab() { SiteId = AppUser.Current.Site.Id, Sort = 999 } : StreamingLiveLib.Tab.Load(id, AppUser.Current.Site.Id);
            tab.Url = TabUrlText.Text;
            tab.TabType = TabType.SelectedValue;
            tab.TabData = (TabType.SelectedValue == "page") ? PageList.SelectedValue : "";
            tab.Text = TabTextText.Text;
            tab.Icon = Request["TabIcon"];

            if (TabType.SelectedValue == "page") tab.Url = $"/data/{AppUser.Current.Site.KeyName}/page{PageList.SelectedValue}.html";
            else if (TabType.SelectedValue == "chat") tab.Url = "/chat.html";
            else if (TabType.SelectedValue == "prayer") tab.Url = "/prayer.html";

            tab.Save();

            if (id == 0)
            {
                LoadData();
                tabs.UpdateSort();
            }

            UpdateData();
            Populate();
        }

        protected void DeleteTabButton_Click(object sender, EventArgs e)
        {
            int id = Convert.ToInt32(TabIdHid.Value);
            if (id > 0)
            {
                StreamingLiveLib.Tab.Delete(id, AppUser.Current.Site.Id);
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
            EditTabShow(0);
        }

        protected void TabType_SelectedIndexChanged(object sender, EventArgs e)
        {
            int id = Convert.ToInt32(TabIdHid.Value);
            StreamingLiveLib.Tab tab = StreamingLiveLib.Tab.Load(id, AppUser.Current.Site.Id);
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
            LinkButton EditButton = (LinkButton)e.Item.FindControl("EditButton");

            StreamingLiveLib.Tab tab = (StreamingLiveLib.Tab)e.Item.DataItem;
            EditButton.CommandArgument = tab.Id.ToString();

            if (e.Item.ItemIndex == 0) UpButton.Visible = false;
            if (e.Item.ItemIndex == tabs.Count - 1) DownButton.Visible = false;
        }
    }
}