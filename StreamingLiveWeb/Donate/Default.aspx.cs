using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.Donate
{
    public partial class Default : System.Web.UI.Page
    {
        public string IntentKey = "";
        public string PrepSummary = "";
        public string Name = "";

        protected void Page_Load(object sender, EventArgs e)
        {
            
        }

        protected void SubmitButton_Click(object sender, EventArgs e)
        {
            double amount = Convert.ToDouble(AmountText.Text.Replace("$", "").Replace(",", "").Trim());

            IntentKey = StreamingLiveWeb.StripeHelper.CreateIntent(amount, EmailText.Text);
            PrepFormHolder.Visible = false;
            StripeFormHolder.Visible = true;
            StripeScriptHolder.Visible = true;

            PrepSummary = $"<div class=\"form-group\"><label>Amount</label><div>{amount.ToString("C")}</div></div>";
            if (NameText.Text.Trim() != "") PrepSummary += $"<div class=\"form-group\"><label>Email</label><div>{NameText.Text}</div></div>";
            if (EmailText.Text.Trim()!="") PrepSummary += $"<div class=\"form-group\"><label>Email</label><div>{EmailText.Text}</div></div>";

            Name = NameText.Text.Replace("'", "");

        }
    }
}