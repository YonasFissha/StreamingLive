using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP.Controls
{
    public partial class ButtonEditor : System.Web.UI.UserControl
    {
        public event EventHandler DataUpdated;
        StreamingLiveLib.Buttons buttons;

        protected void Page_Load(object sender, EventArgs e)
        {
        }

        private void LoadData()
        {
            buttons = StreamingLiveLib.Buttons.LoadBySiteId(AppUser.Current.Site.Id);
        }

        public void Populate()
        {
            LoadData();

            ButtonRepeater.DataSource = buttons;
            ButtonRepeater.DataBind();

            ButtonEditHolder.Visible = false;
            ButtonListHolder.Visible = true;
        }


        protected void ButtonRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            if (e.CommandName == "Edit")
            {
                EditButtonShow(Convert.ToInt32(e.CommandArgument));
            }
            else if (e.CommandName == "Up")
            {
                LoadData();
                buttons[e.Item.ItemIndex - 1].Sort = buttons[e.Item.ItemIndex - 1].Sort + 1;
                buttons[e.Item.ItemIndex].Sort = buttons[e.Item.ItemIndex].Sort - 1;
                buttons[e.Item.ItemIndex - 1].Save();
                buttons[e.Item.ItemIndex].Save();
                UpdateData();
            }
            else if (e.CommandName == "Down")
            {
                LoadData();
                buttons[e.Item.ItemIndex + 1].Sort = buttons[e.Item.ItemIndex + 1].Sort - 1;
                buttons[e.Item.ItemIndex].Sort = buttons[e.Item.ItemIndex].Sort + 1;
                buttons[e.Item.ItemIndex + 1].Save();
                buttons[e.Item.ItemIndex].Save();
                UpdateData();
            }
        }

        private void EditButtonShow(int id)
        {
            StreamingLiveLib.Button button = (id == 0) ? new StreamingLiveLib.Button() : StreamingLiveLib.Button.Load(id, AppUser.Current.Site.Id);

            ButtonEditHolder.Visible = true;
            ButtonListHolder.Visible = false;

            ButtonIdHid.Value = button.Id.ToString();
            ButtonUrlText.Text = button.Url;
            ButtonTextText.Text = button.Text;
            DeleteButtonHolder.Visible = id > 0;
        }

        protected void SaveButtonButton_Click(object sender, EventArgs e)
        {
            int id = Convert.ToInt32(ButtonIdHid.Value);
            StreamingLiveLib.Button button = (id == 0) ? new StreamingLiveLib.Button() { SiteId = AppUser.Current.Site.Id, Sort=999 } : StreamingLiveLib.Button.Load(id, AppUser.Current.Site.Id);
            button.Url = ButtonUrlText.Text;
            button.Text = ButtonTextText.Text;
            button.Save();

            if (id == 0)
            {
                LoadData();
                buttons.UpdateSort();
            }

            UpdateData();
            Populate();
        }

        protected void DeleteButtonButton_Click(object sender, EventArgs e)
        {
            int id = Convert.ToInt32(ButtonIdHid.Value);
            if (id > 0)
            {
                StreamingLiveLib.Button.Delete(id, AppUser.Current.Site.Id);
                UpdateData();
            }
            Populate();
        }

        protected void CancelButtonButton_Click(object sender, EventArgs e)
        {
            Populate();
        }

        protected void AddButtonLink_Click(object sender, EventArgs e)
        {
            EditButtonShow(0);
        }
        private void UpdateData()
        {
            DataUpdated(null, null);
        }

        protected void ButtonRepeater_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            LinkButton UpButton = (LinkButton)e.Item.FindControl("UpButton");
            LinkButton DownButton = (LinkButton)e.Item.FindControl("DownButton");
            LinkButton EditButton = (LinkButton)e.Item.FindControl("EditButton");
            
            StreamingLiveLib.Button button = (StreamingLiveLib.Button)e.Item.DataItem;
            EditButton.CommandArgument = button.Id.ToString();

            if (e.Item.ItemIndex == 0) UpButton.Visible = false;
            if (e.Item.ItemIndex == buttons.Count - 1) DownButton.Visible = false;
        }
    }
}