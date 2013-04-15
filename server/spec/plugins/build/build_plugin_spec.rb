require 'plugins/build/build_plugin'

module Jashboard
  module Plugin
    module Build
      describe BuildPlugin do
        it("should extend MonitorTypeAdapter") do
          subject.class.ancestors.should include(Jashboard::MonitorTypeAdapter)
        end
      end
    end
  end
end
