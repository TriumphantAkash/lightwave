﻿/*
 * Copyright © 2012-2015 VMware, Inc.  All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS, without
 * warranties or conditions of any kind, EITHER EXPRESS OR IMPLIED.  See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace VMDirSchemaSnapIn.UI
{
    public partial class SelectItemsWindow : Form
    {
        public List<string> ItemsToSelect;
        public List<string> AllItems;

        public List<string> SelectedItemsList { get; set; }

        public SelectItemsWindow(List<string> items)
        {
            InitializeComponent();
            this.ItemsToSelect = items;
            this.AllItems = items;
            Initialise();
        }

        public void Initialise()
        {
            SelectedItemsList = new List<string>();

            this.FromList.DataSource = ItemsToSelect;
            this.ToList.DataSource = null;
        }

        private void AddButton_Click(object sender, EventArgs e)
        {
            int row = (int)this.FromList.SelectedIndex;
            if (row >= 0)
            {
                SelectedItemsList.Add(this.FromList.SelectedValue.ToString());
                //The datasource has to be explicitly set to null before we refresh the list. it doesnt seem to work by reference.
                //Todo - find if there is a better mechanism to do this without resetting datasource.
                this.ToList.DataSource = null;
                this.ToList.DataSource = SelectedItemsList;
                ToList.Refresh();
            }

        }

        private void RemoveButton_Click(object sender, EventArgs e)
        {
            int row = (int)this.ToList.SelectedIndex;
            if (row >= 0)
            {
                SelectedItemsList.RemoveAt(row);
                this.ToList.DataSource = null;
                this.ToList.DataSource = SelectedItemsList;
                this.ToList.Refresh();
            }
            
        }

        private void ApplyButton_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.OK;
            this.Close();
        }

        private void CancelButton_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;
            this.Close();
        }

        private void SearchButton_Click(object sender, EventArgs e)
        {
            if (!string.IsNullOrWhiteSpace(this.SearchTextBox.Text))
            {
                ItemsToSelect = ItemsToSelect.FindAll(p => p.StartsWith(this.SearchTextBox.Text));
                this.FromList.DataSource = null;
                this.FromList.DataSource = ItemsToSelect;
                this.FromList.Refresh();
            }
        }

        private void ResetButton_Click(object sender, EventArgs e)
        {
            ItemsToSelect = AllItems;
            this.SearchTextBox.Text = string.Empty;
            this.FromList.DataSource = null;
            this.FromList.DataSource = ItemsToSelect;
            this.FromList.Refresh();
        }
    }
}