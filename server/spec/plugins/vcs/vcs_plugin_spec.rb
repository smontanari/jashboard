require 'plugins/vcs/vcs_plugin'

module Jashboard
  module Plugin
    module Vcs
      describe VcsPlugin do
        it("should extend MonitorTypeAdapter") do
          subject.class.ancestors.should include(Jashboard::MonitorTypeAdapter)
        end
      end
    end
  end
end
