using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace VisorADP.Models
{
    public class KMLFileResponse
    {
        public string Error { get; set; }
        public string FilePath { get; set; }
        public string DownloadUrl { get; set; }
        public string FileName { get; set; }
    }
}