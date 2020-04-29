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
        public JObject Data;
        JArray buttons;

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public void Populate()
        {
            buttons = (JArray)Data["buttons"];
            ButtonRepeater.DataSource = buttons;
            ButtonRepeater.DataBind();

            ButtonEditHolder.Visible = false;
            ButtonListHolder.Visible = true;
        }


        protected void ButtonRepeater_ItemCommand(object source, RepeaterCommandEventArgs e)
        {
            buttons = (JArray)Data["buttons"];
            if (e.CommandName == "Edit")
            {
                EditButtonShow(e.Item.ItemIndex);
            }
            else if (e.CommandName == "Up")
            {
                JObject button = (JObject)buttons[e.Item.ItemIndex];
                buttons.RemoveAt(e.Item.ItemIndex);
                buttons.Insert(e.Item.ItemIndex - 1, button);
                UpdateData();
            }
            else if (e.CommandName == "Down")
            {
                JObject button = (JObject)buttons[e.Item.ItemIndex];
                buttons.RemoveAt(e.Item.ItemIndex);
                buttons.Insert(e.Item.ItemIndex + 1, button);
                UpdateData();
            }
        }

        private void EditButtonShow(int idx)
        {
            buttons = (JArray)Data["buttons"];
            JObject button = (idx == -1) ? new JObject() : (JObject)buttons[idx];
            ButtonEditHolder.Visible = true;
            ButtonListHolder.Visible = false;

            ButtonIndexHid.Value = idx.ToString();
            ButtonUrlText.Text = Convert.ToString(button["url"]);
            ButtonTextText.Text = Convert.ToString(button["text"]);

            DeleteButtonHolder.Visible = idx > -1;

        }

        protected void SaveButtonButton_Click(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(ButtonIndexHid.Value);
            JArray buttons = (JArray)Data["buttons"];
            JObject button = (idx == -1) ? new JObject() : (JObject)buttons[idx];
            button["url"] = ButtonUrlText.Text;
            button["text"] = ButtonTextText.Text;
            if (idx == -1) buttons.Add(button);
            UpdateData();
            Populate();
        }

        protected void DeleteButtonButton_Click(object sender, EventArgs e)
        {
            int idx = Convert.ToInt32(ButtonIndexHid.Value);
            if (idx > -1)
            {
                JArray buttons = (JArray)Data["buttons"];
                buttons.RemoveAt(idx);
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
            EditButtonShow(-1);
        }
        private void UpdateData()
        {
            DataUpdated(null, null);
        }

        protected void ButtonRepeater_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            LinkButton UpButton = (LinkButton)e.Item.FindControl("UpButton");
            LinkButton DownButton = (LinkButton)e.Item.FindControl("DownButton");
            if (e.Item.ItemIndex == 0) UpButton.Visible = false;
            if (e.Item.ItemIndex == buttons.Count - 1) DownButton.Visible = false;
        }
    }
}