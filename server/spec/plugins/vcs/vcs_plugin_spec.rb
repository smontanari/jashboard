require 'spec_helper'
require 'plugins/vcs/vcs_plugin'

module Jashboard
  module Plugin
    module Vcs
      describe VcsPlugin do
        it("should implement the configured adapters") do
          plugin = VcsPlugin.new
          ['git'].each do |type|
            plugin.should respond_to("get_#{type}_runtime_info".to_sym)
          end
        end
      end
    end
  end
end
