using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace StreamingLiveWeb.CP.Controls
{
    public partial class AppearanceEditor : System.Web.UI.UserControl
    {
        public event EventHandler DataUpdated;
        StreamingLiveLib.Site site;

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public void Populate()
        {
            site = AppUser.Current.Site;
            if (site.LogoUrl == "" || site.LogoUrl==null) LogoLit.Text = "none";
            else LogoLit.Text = "<img src=\"" +  site.LogoUrl + "\" class=\"img-fluid\" />";
            HomePageText.Text = site.HomePageUrl;
            PrimaryColorText.Text = site.PrimaryColor;
            ContrastColorText.Text = site.ContrastColor;
            HeaderColorText.Text = site.HeaderColor;
        }

        protected void SaveAppearanceButton_Click(object sender, EventArgs e)
        {
            site = AppUser.Current.Site;
            site.HomePageUrl = HomePageText.Text;
            site.PrimaryColor = PrimaryColorText.Text;
            site.ContrastColor = ContrastColorText.Text;
            site.HeaderColor = HeaderColorText.Text;

            if (LogoUpload.HasFile)
            {
                string tempFile = Server.MapPath("/temp/" + AppUser.Current.UserData.Id.ToString() + ".png");
                LogoUpload.SaveAs(tempFile);
                System.Drawing.Image img = System.Drawing.Bitmap.FromFile(tempFile);

                var ratio = 150.0 / Convert.ToDouble(img.Height);
                System.Drawing.Image outImg = new System.Drawing.Bitmap(Convert.ToInt32(img.Width * ratio), 150);
                System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(outImg);
                g.CompositingMode = CompositingMode.SourceCopy;
                g.CompositingQuality = CompositingQuality.HighQuality;
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                Rectangle destRect = new Rectangle(0, 0, outImg.Width, outImg.Height);

                ImageAttributes wrapMode = new ImageAttributes();
                wrapMode.SetWrapMode(WrapMode.TileFlipXY); ;

                g.DrawImage(img, destRect, 0, 0, img.Width, img.Height, GraphicsUnit.Pixel, wrapMode);
                outImg.Save(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/logo.png"));
                site.LogoUrl = "/data/" + AppUser.Current.Site.KeyName + "/logo.png?dt=" + DateTime.Now.ToString("Mdyyyyhhmmss");

                g.Dispose();
                img.Dispose();

                System.IO.File.Delete(tempFile);

            }

            //string previewCss = ":root { --primaryColor: " + PrimaryColorText.Text + "; --contrastColor: " + ContrastColorText.Text + "; --headerColor: " + HeaderColorText.Text + "}";
            //System.IO.File.WriteAllText(Server.MapPath("/data/" + AppUser.Current.Site.KeyName + "/preview.css"), previewCss);

            site.Save();
            UpdateData();
            Populate();
        }

        private void UpdateData()
        {
            DataUpdated(null, null);
        }

    }
}